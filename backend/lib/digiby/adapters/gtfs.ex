defmodule GTFS do
  @stops_table_name :norrbotten_stops
  @services_table_name :norrbotten_services
  @stop_times_table_name :norrbotten_stop_times
  @routes_table_name :norrbotten_routes
  @shapes_table_name :norrbotten_shapes
  @trips_table_name :norrbotten_trips
  def load_cache_in_ets do
    :ets.new(@stops_table_name, [:set, :public, :named_table])
    :ets.new(@routes_table_name, [:set, :public, :named_table])
    :ets.new(@services_table_name, [:duplicate_bag, :public, :named_table])
    :ets.new(@stop_times_table_name, [:duplicate_bag, :public, :named_table])
    :ets.new(@shapes_table_name, [:duplicate_bag, :public, :named_table])
    :ets.new(@trips_table_name, [:duplicate_bag, :public, :named_table])

    Enum.map(
      [
        &load_stops/0,
        &load_services/0,
        &load_trips/0,
        &load_routes/0,
        &load_shapes/0
      ],
      &Task.async/1
    )
    |> Enum.each(&Task.await(&1, 50_000))
    |> then(fn _ -> load_stop_times() end)
  end

  def get_buses(date) do
    :ets.lookup(:norrbotten_services, date)
    |> Enum.map(&(elem(&1, 1) |> Map.get(:service_id)))
    |> Enum.flat_map(fn service_id -> :ets.lookup(:norrbotten_trips, service_id) end)
    |> Enum.map(fn {_, values} -> values end)
    |> Enum.map(fn %{shape_id: shape_id} = trip ->
      shape =
        :ets.lookup(:norrbotten_shapes, shape_id)
        |> Enum.map(fn {_, v} -> v end)

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

  defp load_stops() do
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
    |> Enum.each(fn tuple -> :ets.insert(:norrbotten_stops, tuple) end)

    IO.puts("Stops loaded")
  end

  defp load_services do
    "calendar_dates.txt"
    |> get_decoded_csv_stream()
    |> Enum.map(fn value ->
      {value["date"], %{service_id: value["service_id"], exception_type: value["exception_type"]}}
    end)
    |> Enum.each(fn tuple -> :ets.insert(@services_table_name, tuple) end)

    IO.puts("Services loaded")
  end

  defp load_stop_times do
    IO.inspect(:ets.first(:norrbotten_stops))

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
        @stop_times_table_name,
        {trip_id, %{stop_position: stop_position, arrival_time: timestr_to_time(arrival_time)}}
      )
    end)

    IO.puts("Stop times loaded")
  end

  def timestr_to_time("24" <> rest), do: timestr_to_time("00" <> rest)

  def timestr_to_time(time), do: Time.from_iso8601!(time)

  defp load_trips do
    "trips.txt"
    |> get_decoded_csv_stream()
    |> Stream.map(fn trip -> Map.take(trip, ["service_id", "trip_id", "route_id", "shape_id"]) end)
    |> Enum.each(fn trip ->
      :ets.insert(
        @trips_table_name,
        {trip["service_id"],
         %{trip_id: trip["trip_id"], route_id: trip["route_id"], shape_id: trip["shape_id"]}}
      )
    end)

    IO.puts("Trips loaded")
  end

  defp load_routes do
    "routes.txt"
    |> get_decoded_csv_stream()
    |> Stream.map(fn e -> Map.take(e, ["route_id", "route_short_name"]) end)
    |> Enum.reduce(%{}, fn value, acc ->
      Map.put(acc, value["route_id"], %{
        line_number: value["route_short_name"]
      })
    end)
    |> Enum.each(fn tuple -> :ets.insert(@routes_table_name, tuple) end)

    IO.puts("Routes loaded")
  end

  defp load_shapes do
    "shapes.txt"
    |> get_decoded_csv_stream()
    |> Stream.map(fn e -> Map.take(e, ["shape_id", "shape_pt_lat", "shape_pt_lon"]) end)
    |> Enum.each(fn %{"shape_id" => id, "shape_pt_lon" => lon, "shape_pt_lat" => lat} ->
      :ets.insert(
        @shapes_table_name,
        {id,
         [
           Float.parse(lon) |> elem(0),
           Float.parse(lat) |> elem(0)
         ]}
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
