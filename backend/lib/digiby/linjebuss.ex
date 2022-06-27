defmodule Digiby.Linjebuss do
  @kiruna_polisstation {20.222821, 67.857271}
  @forsamlingshemmet {20.236833, 67.851933}
  @kiruna_radarn {20.2776983, 67.839335}
  @svappavaara_konsum {21.0448641, 67.6484589}
  @kiruna_kastanjen {20.2703692, 67.838188}

  def list_transports(date_time, from_position, to_position) do
    buses = GTFS.get_buses("20220621")

    bz =
      for bus <- buses do
        best_pickup_bus_stop = find_nearest_bus_stop(@svappavaara_konsum, bus)
        best_drop_off_bus_stop = find_nearest_bus_stop(@kiruna_kastanjen, bus)

        {bus[:trip_id], best_pickup_bus_stop, best_drop_off_bus_stop}
      end

    {best_trip_id, best_start_stop, best_stop_stop} =
      Enum.min_by(bz, fn {_trip_id, %{stop_distance: distance_to_pickup},
                          %{stop_distance: distance_to_dropoff}} ->
        distance_to_pickup + distance_to_dropoff
      end)

    IO.inspect(best_start_stop)
    IO.inspect(best_stop_stop)
    IO.inspect(best_trip_id)

    Enum.filter(buses, fn %{trip_id: id} -> best_trip_id == id end)
    |> Enum.map(fn %{stops: stops} ->
      Enum.drop_while(stops, fn %{"stop" => %{name: name}} ->
        name != best_start_stop["stop"][:name]
      end)
      |> Enum.take_while(fn %{"stop" => %{name: name}} ->
        name != best_stop_stop["stop"][:name]
      end)
      |> Enum.concat([best_stop_stop])
    end)
    |> IO.inspect(label: "filtered")

    [%Transport{}]
  end

  def find_nearest_bus_stop(position, bus, after_time \\ ~T[00:00:00]) do
    bus[:stops]
    |> Enum.filter(&is_bus_stop_time_after?(&1, after_time))
    |> Enum.map(fn %{"stop" => %{lng: lng, lat: lat}} = stop ->
      Map.put(
        stop,
        :stop_distance,
        Distance.GreatCircle.distance(
          {String.to_float(lng), String.to_float(lat)},
          position
        )
      )
    end)
    |> Enum.min_by(fn %{stop_distance: distance} -> distance end)
  end

  def is_bus_stop_time_after?(%{"arrival_time" => "24" <> minute_and_second}, after_time),
    do: is_bus_stop_time_after?(%{"arrival_time" => "00" <> minute_and_second}, after_time)

  def is_bus_stop_time_after?(%{"arrival_time" => time}, after_time) do
    after_time
    |> Time.diff(Time.from_iso8601!(time))
    |> Kernel.<(0)
  end
end
