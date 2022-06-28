defmodule GTFS do
  def cache_in_ets do
    load_stops()
    load_services()
    load_stop_times()
    load_trips()
    load_routes()
    load_shapes()
  end

  def get_buses(date) do
    :ets.lookup(:norrbotten_services, date)
    |> Enum.map(&(elem(&1, 1) |> Map.get(:service_id)))
    |> Enum.flat_map(fn service_id -> :ets.lookup(:norrbotten_trips, service_id) end)
    |> Enum.map(fn {_, values} -> values end)
    |> Enum.map(fn %{shape_id: shape_id} = trip ->
      shape = :ets.lookup(:norrbotten_shapes, shape_id) |> Enum.map(fn {_, v} -> v end)

      Map.put(trip, :geometry, shape)
    end)
    |> Enum.map(fn %{trip_id: trip_id} = trip ->
      Map.put(
        trip,
        :stop_times,
        :ets.lookup(:norrbotten_stop_times, trip_id) |> Enum.map(&elem(&1, 1))
      )
    end)
    |> Enum.map(fn %{route_id: route_id} = trip ->
      Map.put(
        trip,
        :line_number,
        :ets.lookup(:norrbotten_routes, route_id)
        |> List.first()
        |> elem(1)
        |> Map.get(:line_number)
      )
    end)
    |> Enum.group_by(fn %{trip_id: trip_id} -> trip_id end)
    |> Enum.map(fn {trip_id, [values | _]} ->
      filtered_values = Map.drop(values, [:trip_id, :route_id, :line_number])

      %{
        stop_times: filtered_values.stop_times,
        trip_id: trip_id,
        line_number: values.line_number,
        geometry: values.geometry
      }
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
    |> Enum.each(fn %{
                      "trip_id" => trip_id,
                      "stop" => stop_position,
                      "arrival_time" => arrival_time
                    } ->
      :ets.insert(
        table,
        {trip_id, %{stop_position: stop_position, arrival_time: timestr_to_time(arrival_time)}}
      )
    end)

    IO.puts("Stop times loaded")
  end

  def timestr_to_time("24" <> rest), do: timestr_to_time("00" <> rest)

  def timestr_to_time(time), do: Time.from_iso8601!(time)

  defp load_trips do
    table = :ets.new(:norrbotten_trips, [:duplicate_bag, :public, :named_table])

    "trips.txt"
    |> get_decoded_csv_stream()
    |> Stream.map(fn trip -> Map.take(trip, ["service_id", "trip_id", "route_id", "shape_id"]) end)
    |> Enum.each(fn trip ->
      :ets.insert(
        table,
        {trip["service_id"],
         %{trip_id: trip["trip_id"], route_id: trip["route_id"], shape_id: trip["shape_id"]}}
      )
    end)
  end

  defp load_routes do
    table = :ets.new(:norrbotten_routes, [:set, :public, :named_table])

    "routes.txt"
    |> get_decoded_csv_stream()
    |> Stream.map(fn e -> Map.take(e, ["route_id", "route_short_name"]) end)
    |> Enum.reduce(%{}, fn value, acc ->
      Map.put(acc, value["route_id"], %{
        line_number: value["route_short_name"]
      })
    end)
    |> Enum.each(fn tuple -> :ets.insert(table, tuple) end)
  end

  defp load_shapes do
    table = :ets.new(:norrbotten_shapes, [:duplicate_bag, :public, :named_table])

    "shapes.txt"
    |> get_decoded_csv_stream()
    |> Stream.map(fn e -> Map.take(e, ["shape_id", "shape_pt_lat", "shape_pt_lon"]) end)
    |> Enum.each(fn shape ->
      :ets.insert(
        table,
        {shape["shape_id"], %{lat: shape["shape_pt_lat"], lng: shape["shape_pt_lon"]}}
      )
    end)

    IO.puts("Shapes loaded")
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
