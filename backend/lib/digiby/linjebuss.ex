defmodule Digiby.Linjebuss do
  def list_transports(_date_time, from_position, to_position) do
    buses = GTFS.get_buses("20220621")

    best_matches_for_lines =
      for bus <- buses do
        best_pickup_bus_stop = find_nearest_bus_stop(from_position, bus)

        best_drop_off_bus_stop =
          find_nearest_bus_stop(
            to_position,
            bus,
            best_pickup_bus_stop[:arrival_time]
          )

        {bus[:trip_id], best_pickup_bus_stop, best_drop_off_bus_stop}
      end
      |> Enum.reject(fn e -> e |> Tuple.to_list() |> Enum.any?(&is_nil/1) end)

    {best_trip_id, best_start_stop, best_stop_stop} =
      Enum.min_by(best_matches_for_lines, fn {_trip_id, %{stop_distance: distance_to_pickup},
                                              %{stop_distance: distance_to_dropoff}} ->
        distance_to_pickup + distance_to_dropoff
      end)

    Enum.filter(buses, fn %{trip_id: id} -> best_trip_id == id end)
    |> Enum.map(fn %{stop_times: stops} = bus ->
      stops =
        Enum.drop_while(stops, fn %{stop_position: %{name: name}} ->
          name != best_start_stop[:stop_position][:name]
        end)
        |> Enum.take_while(fn %{stop_position: %{name: name}} ->
          name != best_stop_stop[:stop_position][:name]
        end)
        |> Enum.concat([best_stop_stop])

      %{bus | stop_times: stops}
    end)
    |> Enum.map(fn bus ->
      {first_stop, last_stop} = {List.first(bus.stop_times), List.last(bus.stop_times)}

      travel_time =
        Time.diff(
          last_stop[:arrival_time],
          first_stop[:arrival_time]
        )

      %Transport{
        line_number: bus.line_number,
        transportation_type: :linje_buss,
        travel_time: travel_time,
        cost: 900_000,
        departure: first_stop[:stop_position],
        destination: last_stop[:stop_position],
        stops: bus.stop_times
      }
    end)
  end

  def find_nearest_bus_stop(position, bus, after_time \\ ~T[00:00:00]) do
    bus.stop_times
    |> Enum.filter(&is_bus_stop_time_after?(&1, after_time))
    |> Enum.map(fn %{stop_position: %{lng: lng, lat: lat}} = stop ->
      Map.put(
        stop,
        :stop_distance,
        Distance.GreatCircle.distance(
          {String.to_float(lng), String.to_float(lat)},
          position
        )
      )
    end)
    |> Enum.min_by(fn %{stop_distance: distance} -> distance end, &<=/2, fn -> nil end)
  end

  def is_bus_stop_time_after?(%{arrival_time: time}, after_time) do
    after_time
    |> Time.diff(time)
    |> Kernel.<(0)
  end
end
