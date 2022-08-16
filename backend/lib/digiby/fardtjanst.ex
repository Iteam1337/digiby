defmodule Digiby.Fardtjanst do
  alias Digiby.Transport
  @maximum_walking_distance 2500
  # Travel time in seconds
  @max_extra_travel_time_for_fardtjanst 360

  def list_transports(date, options) do
    start_time =
      Keyword.get(options, :start_time, ~T[00:00:00])
      |> IO.inspect(label: "start time")

    query_from_position = Keyword.get(options, :from)
    query_to_position = Keyword.get(options, :to)
    end_time = Keyword.get(options, :end_time, ~T[23:59:59])
    {_year, month, day} = Date.to_erl(date)

    # pretend it's 2019 to match with data
    new_date = Date.from_erl!({2019, month, day})

    Digiby.Adapters.Fardtjanst.get_transports(Date.to_string(new_date))
    |> Enum.map(fn %{
                     "type" => type,
                     "from_position" => from_position,
                     "from_street" => from_street,
                     "departure_time" => departure_time,
                     "to_position" => to_position,
                     "to_street" => to_street,
                     "id" => id
                   } ->
      from_stop_position = Map.put(from_position, :name, from_street)
      to_stop_position = Map.put(to_position, :name, to_street)

      first_stop =
        Map.new()
        |> Map.put(:arrival_time, departure_time)
        |> Map.put(:stop_position, from_stop_position)

      last_stop =
        Map.new()
        |> Map.put(:arrival_time, departure_time)
        |> Map.put(:stop_position, to_stop_position)

      %{"duration" => duration} = Osrm.route(first_stop.stop_position, last_stop.stop_position)

      last_stop =
        Map.update!(last_stop, :arrival_time, fn start_time ->
          Time.from_iso8601!(start_time) |> Time.add(trunc(duration)) |> Time.truncate(:second)
        end)

      %{
        id: id,
        type: type,
        start_stop:
          first_stop
          |> Map.put(
            :meters_from_query_to_stop,
            get_meters_between_positions(first_stop.stop_position, query_from_position)
          ),
        last_stop:
          last_stop
          |> Map.put(
            :meters_from_query_to_stop,
            get_meters_between_positions(last_stop.stop_position, query_to_position)
          ),
        stop_times: [first_stop, last_stop],
        travel_time: duration
      }
    end)
    |> Enum.filter(fn %{start_stop: departure} ->
      Time.compare(Time.from_iso8601!(departure.arrival_time), start_time) == :gt
    end)
    |> Enum.filter(fn %{start_stop: departure, last_stop: destination} ->
      {query_to_lng, query_to_lat} = query_to_position

      before_duration =
        Osrm.route([departure.stop_position, destination.stop_position]) |> Map.get("duration")

      after_duration =
        Osrm.route([
          departure.stop_position,
          %{"lat" => query_to_lat, "lng" => query_to_lng},
          destination.stop_position
        ])
        |> Map.get("duration")

      after_duration - before_duration < @max_extra_travel_time_for_fardtjanst
    end)
    |> Enum.sort_by(
      fn %{start_stop: destination1} -> Time.from_iso8601!(destination1.arrival_time) end,
      Time
    )
    |> Enum.map(fn %{start_stop: departure} = trip ->
      Map.put_new_lazy(trip, :geometry, fn ->
        {query_to_lng, query_to_lat} = query_to_position

        Osrm.route(departure.stop_position, %{"lat" => query_to_lat, "lng" => query_to_lng})
        |> IO.inspect()
        |> Map.get("geometry")
        |> Map.get("coordinates")
      end)
    end)
    |> Enum.map(&fardtjanst_to_transport_struct/1)
  end

  defp fardtjanst_to_transport_struct(
         %{
           start_stop: start_stop,
           last_stop: last_stop,
           geometry: geometry,
           travel_time: travel_time
         } = trip
       ),
       do: %Transport{
         id: trip.id,
         line_number: nil,
         agency: "Länstrafiken Norrbotten",
         vehicle_type: "Liten bil",
         transportation_type: trip.type,
         travel_time: travel_time,
         cost: 900_000,
         departure: start_stop,
         destination: last_stop,
         stops: trip.stop_times,
         geometry: geometry
       }

  defp get_meters_between_positions(%{"lat" => lat1, "lng" => lng1}, pos2) do
    Distance.GreatCircle.distance(
      {lng1, lat1},
      pos2
    )
  end
end
