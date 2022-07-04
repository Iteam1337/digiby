defmodule Digiby.Linjebuss do
  alias Digiby.Transport
  @maximum_walking_distance 2500
  def list_transports(date, options) do
    trips = GTFS.get_buses(date)
    start_time = Keyword.get(options, :start_time, ~T[00:00:00])
    from_position = Keyword.get(options, :from)
    to_position = Keyword.get(options, :to)
    end_time = Keyword.get(options, :end_time, ~T[23:59:59])

    best_sorted_departures =
      trips
      |> get_best_matches_for_trips(from_position, to_position, start_time, end_time)
      |> sort_matches()

    best_trip_ids =
      best_sorted_departures |> Enum.map(fn {best_trip_id, _, _, _} -> best_trip_id end)

    trips
    |> Enum.filter(fn %{trip_id: id} -> id in best_trip_ids end)
    |> Enum.map(fn %{stop_times: stops, trip_id: id} = bus ->
      {_, best_start_stop, best_stop_stop, _} =
        best_sorted_departures
        |> Enum.find(nil, fn {best_trip_id, _, _, _} -> best_trip_id == id end)

      stops =
        Enum.drop_while(stops, fn %{stop_position: %{name: name}} ->
          name != best_start_stop[:stop_position][:name]
        end)
        |> Enum.take_while(fn %{stop_position: %{name: name}} ->
          name != best_stop_stop[:stop_position][:name]
        end)
        |> Enum.concat([Map.drop(best_stop_stop, [:meters_from_query_to_stop])])

      {%{bus | stop_times: stops}, {best_start_stop, best_stop_stop}}
    end)
    |> Enum.map(fn {bus, {best_start_stop, best_stop_stop}} ->
      {first_stop, last_stop} = {List.first(bus.stop_times), List.last(bus.stop_times)}

      travel_time =
        Time.diff(
          last_stop[:arrival_time],
          first_stop[:arrival_time]
        )

      %Transport{
        line_number: bus.line_number,
        transportation_type: "Länstrafiken, stomlinje",
        travel_time: travel_time,
        cost: 900_000,
        departure: best_start_stop,
        destination: best_stop_stop,
        stops: bus.stop_times,
        geometry: bus.geometry
      }
    end)
  end

  def sort_matches(best_matches_for_trips),
    do:
      best_matches_for_trips
      |> Enum.sort_by(fn {_trip_id,
                          %{
                            meters_from_query_to_stop: distance_to_pickup
                          },
                          %{
                            meters_from_query_to_stop: distance_to_dropoff
                          }, _} ->
        distance_to_pickup + distance_to_dropoff
      end)

  def get_best_matches_for_trips(trips, from_position, to_position, after_time, before_time) do
    for trip <- trips do
      best_pickup_bus_stop = find_nearest_bus_stop(from_position, trip, after_time, before_time)

      if best_pickup_bus_stop do
        best_drop_off_bus_stop =
          find_nearest_bus_stop(
            to_position,
            trip,
            best_pickup_bus_stop[:arrival_time]
          )

        {trip[:trip_id], best_pickup_bus_stop, best_drop_off_bus_stop, trip.line_number}
      else
        {nil}
      end
    end
    |> Enum.reject(fn e -> e |> Tuple.to_list() |> Enum.any?(&is_nil/1) end)
  end

  def find_nearest_bus_stop(
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

  def is_bus_stop_time_after?(%{arrival_time: time}, after_time) do
    after_time
    |> Time.diff(time)
    |> Kernel.<(0)
  end

  def is_bus_stop_time_before?(%{arrival_time: time}, before_time) do
    before_time
    |> Time.diff(time)
    |> Kernel.>(0)
  end
end
