defmodule Digiby.Linjebuss do
  alias Digiby.Transport
  @maximum_walking_distance 2500
  @gtfs_adapter Application.get_env(:digiby, :gtfs) || GTFS

  def list_transports(date, options) do
    start_time = Keyword.get(options, :start_time, ~T[00:00:00])
    from_position = Keyword.get(options, :from)
    to_position = Keyword.get(options, :to)
    end_time = Keyword.get(options, :end_time, ~T[23:59:59])

    @gtfs_adapter.get_buses(date)
    |> get_best_matches_for_trips(from_position, to_position, start_time, end_time)
    |> sort_matches()
    |> Enum.map(&bus_to_transport_struct/1)
  end

  defp bus_to_transport_struct(
         %{bussstop_closest_to_start: start_stop, busstop_closest_to_stop: last_stop} = bus
       ),
       do: %Transport{
         line_number: bus.line_number,
         transportation_type: "Länstrafiken, #{route_type_to_redable(bus.route_type)}",
         travel_time: Time.diff(last_stop[:arrival_time], start_stop[:arrival_time]),
         cost: 900_000,
         departure: start_stop,
         destination: last_stop,
         stops: bus.stop_times,
         geometry:
           @gtfs_adapter.get_geometry(bus.shape_id)
           |> filter_geometry(start_stop.stop_position, last_stop.stop_position)
       }

  defp route_type_to_redable("700"), do: "Stomlinje"
  defp route_type_to_redable("1501"), do: "Anropsstyrd"

  defp filter_superflous_stops(
         %{bussstop_closest_to_start: start_stop, busstop_closest_to_stop: end_stop} = bus
       ),
       do:
         Map.update!(bus, :stop_times, fn all_stops_in_trip ->
           Enum.drop_while(all_stops_in_trip, fn %{stop_position: %{name: name}} ->
             name != start_stop[:stop_position][:name]
           end)
           |> Enum.reverse()
           |> Enum.drop_while(fn %{stop_position: %{name: name}} ->
             name != end_stop[:stop_position][:name]
           end)
           |> Enum.reverse()
         end)

  defp filter_geometry(geometry, start_coord, stop_coord),
    do:
      geometry
      |> Enum.drop_while(fn coord ->
        coord != Enum.map([start_coord.lng, start_coord.lat], &String.to_float/1)
      end)
      |> Enum.reverse()
      |> Enum.drop_while(fn coord ->
        coord != Enum.map([stop_coord.lng, stop_coord.lat], &String.to_float/1)
      end)
      |> Enum.reverse()

  defp sort_matches(best_matches_for_trips),
    do:
      best_matches_for_trips
      |> Enum.sort_by(fn %{
                           bussstop_closest_to_start: start_stop,
                           busstop_closest_to_stop: end_stop
                         } ->
        start_stop.meters_from_query_to_stop + end_stop.meters_from_query_to_stop
      end)

  defp get_best_matches_for_trips(trips, from_position, to_position, after_time, before_time) do
    for trip <- trips do
      best_pickup_bus_stop = find_nearest_bus_stop(from_position, trip, after_time, before_time)

      if best_pickup_bus_stop do
        best_drop_off_bus_stop =
          find_nearest_bus_stop(
            to_position,
            trip,
            best_pickup_bus_stop[:arrival_time]
          )

        if best_drop_off_bus_stop,
          do:
            trip
            |> Map.put(:bussstop_closest_to_start, best_pickup_bus_stop)
            |> Map.put(:busstop_closest_to_stop, best_drop_off_bus_stop)
            |> filter_superflous_stops()
      else
        nil
      end
    end
    |> Enum.reject(&is_nil/1)
  end

  defp find_nearest_bus_stop(
         position,
         bus,
         after_time \\ ~T[00:00:00],
         before_time \\ ~T[23:59:59]
       ) do
    bus.stop_times
    |> Enum.filter(&is_bus_stop_time_after?(&1, after_time))
    |> Enum.filter(&is_bus_stop_time_before?(&1, before_time))
    |> Enum.map(fn %{stop_position: %{lng: lng, lat: lat}} = stop ->
      Map.put(
        stop,
        :meters_from_query_to_stop,
        Distance.GreatCircle.distance(
          {String.to_float(lng), String.to_float(lat)},
          position
        )
      )
    end)
    |> Enum.reject(fn %{meters_from_query_to_stop: distance} ->
      distance > @maximum_walking_distance
    end)
    |> Enum.min_by(fn %{meters_from_query_to_stop: distance} -> distance end, &<=/2, fn ->
      nil
    end)
  end

  defp is_bus_stop_time_after?(%{arrival_time: time}, after_time) do
    after_time
    |> Time.diff(time)
    |> Kernel.<(0)
  end

  defp is_bus_stop_time_before?(%{arrival_time: time}, before_time) do
    before_time
    |> Time.diff(time)
    |> Kernel.>(0)
  end
end
