defmodule GTFS do
  def cache_in_ets do
    load_stops()
    load_services()
    load_stop_times()
    load_trips()
  end

  def get_buses(date) do
    :ets.lookup(:norrbotten_services, date)
    |> Enum.map(&(elem(&1, 1) |> Map.get(:service_id)))
    |> Enum.flat_map(fn service_id -> :ets.lookup(:norrbotten_trips, service_id) end)
    |> Enum.map(fn e -> elem(e, 1) end)
    |> Enum.flat_map(fn trip_id -> :ets.lookup(:norrbotten_stop_times, trip_id) end)
    |> Enum.map(fn e -> elem(e, 1) end)
    |> Enum.group_by(fn stop_time -> stop_time["trip_id"] end)
    |> Enum.map(fn {trip_id, values} ->
      values = Enum.map(values, fn stop -> Map.drop(stop, ["trip_id"]) end)
      %{stops: values, trip_id: trip_id}
    end)
  end

  defp load_stops do
    table = :ets.new(:norrbotten_stops, [:set, :public, :named_table])

    "stops.txt"
    |> get_decoded_csv_stream()
    |> Stream.map(fn e -> Map.take(e, ["stop_name", "stop_id", "stop_lon", "stop_lat"]) end)
    |> Enum.reduce(%{}, fn value, acc ->
      Map.put(acc, value["stop_id"], %{
        name: value["stop_name"],
        lat: value["stop_lat"],
        lng: value["stop_lon"]
      })
    end)
    |> Enum.each(fn tuple -> :ets.insert(table, tuple) end)
  end

  defp load_services do
    table = :ets.new(:norrbotten_services, [:duplicate_bag, :public, :named_table])

    "calendar_dates.txt"
    |> get_decoded_csv_stream()
    |> Enum.map(fn value ->
      {value["date"], %{service_id: value["service_id"], exception_type: value["exception_type"]}}
    end)
    |> Enum.each(fn tuple -> :ets.insert(table, tuple) end)

    IO.puts("Services loaded")
  end

  defp load_stop_times do
    table = :ets.new(:norrbotten_stop_times, [:duplicate_bag, :public, :named_table])

    "stop_times.txt"
    |> get_decoded_csv_stream()
    |> Stream.map(fn stop_time ->
      Map.put(stop_time, "stop", get_from_ets(:norrbotten_stops, stop_time["stop_id"]))
    end)
    |> Stream.map(fn stop_time ->
      Map.take(stop_time, ["trip_id", "arrival_time", "stop"])
    end)
    |> Enum.each(fn stop_time -> :ets.insert(table, {stop_time["trip_id"], stop_time}) end)

    IO.puts("Stop times loaded")
  end

  defp load_trips do
    table = :ets.new(:norrbotten_trips, [:duplicate_bag, :public, :named_table])

    "trips.txt"
    |> get_decoded_csv_stream()
    |> Stream.map(fn trip -> Map.take(trip, ["service_id", "trip_id"]) end)
    |> Enum.each(fn trip -> :ets.insert(table, {trip["service_id"], trip["trip_id"]}) end)
  end

  defp get_decoded_csv_stream(file) do
    Path.expand("./data/norrbotten/" <> file, File.cwd!())
    |> File.stream!()
    |> CSV.decode!(headers: true)
  end

  defp get_from_ets(table, key) do
    :ets.lookup(table, key)
    |> List.first()
    |> elem(1)
  end
end
