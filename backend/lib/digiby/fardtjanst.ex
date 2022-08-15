defmodule Digiby.Fardtjanst do
  alias Digiby.Transport

  def list_transports(date, options) do
    start_time = Keyword.get(options, :start_time, ~T[00:00:00])
    from_position = Keyword.get(options, :from)
    to_position = Keyword.get(options, :to)
    end_time = Keyword.get(options, :end_time, ~T[23:59:59])
    {_year, month, day} = Date.to_erl(date)

    # pretend it's 2019
    new_date = Date.from_erl!({2019, month, day})
    IO.inspect(date)

    Digiby.Adapters.Fardtjanst.get_transports(Date.to_string(new_date))
    |> IO.inspect(label: "data")
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
        start_stop: first_stop,
        last_stop: last_stop,
        stop_times: [first_stop, last_stop]
      }
    end)
    |> Enum.map(&fardtjanst_to_transport_struct/1)
    |> IO.inspect()
  end

  defp fardtjanst_to_transport_struct(%{start_stop: start_stop, last_stop: last_stop} = trip),
    do: %Transport{
      line_number: "-",
      transportation_type: "Länstrafiken, #{trip.type}",
      # Time.diff(last_stop[:arrival_time], start_stop[:arrival_time]),
      travel_time: 11,
      cost: 900_000,
      departure: start_stop,
      destination: last_stop,
      stops: trip.stop_times,
      geometry: []
    }
end
