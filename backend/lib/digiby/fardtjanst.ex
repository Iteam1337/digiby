defmodule Digiby.Fardtjanst do
  alias Digiby.Transport
  @maximum_walking_distance 2500

  def list_transports(date, options) do
    start_time = Keyword.get(options, :start_time, ~T[00:00:00])
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
                     "to_street" => to_street
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

      %{
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
        stop_times: [first_stop, last_stop]
      }
    end)
    |> Enum.map(&fardtjanst_to_transport_struct/1)
    |> Enum.sort(fn %Transport{departure: departure1}, %Transport{departure: departure2} ->
      departure1.meters_from_query_to_stop < departure2.meters_from_query_to_stop
    end)

    # |> Enum.filter(fn %Transport{departure: departure, destination: destination} ->
    #   # && destination.meters_from_query_to_stop < @maximum_walking_distance
    #   # departure.meters_from_query_to_stop < @maximum_walking_distance
    # end)
  end

  defp fardtjanst_to_transport_struct(%{start_stop: start_stop, last_stop: last_stop} = trip),
    do: %Transport{
      line_number: nil,
      agency: "Länstrafiken Norrbotten",
      vehicle_type: "",
      transportation_type: trip.type,
      # Time.diff(last_stop[:arrival_time], start_stop[:arrival_time]),
      travel_time: 1,
      cost: 900_000,
      departure: start_stop,
      destination: last_stop,
      stops: trip.stop_times,
      geometry: []
    }

  defp get_meters_between_positions(%{"lat" => lat1, "lng" => lng1}, pos2) do
    Distance.GreatCircle.distance(
      {lng1, lat1},
      pos2
    )
  end
end
