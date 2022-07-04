defmodule DigibyWeb.TransportController do
  use DigibyWeb, :controller

  alias Digiby.Linjebuss

  action_fallback DigibyWeb.FallbackController

  # @kiruna_polisstation {20.222821, 67.857271}
  # @forsamlingshemmet {20.236833, 67.851933}
  # @kiruna_radarn {20.2776983, 67.839335}
  # @svappavaara_konsum {21.0448641, 67.6484589}
  # @kiruna_kastanjen {20.2703692, 67.838188}

  def index(
        conn,
        %{
          "fromLat" => fromLat,
          "fromLng" => fromLng,
          "toLat" => toLat,
          "toLng" => toLng,
          "date" => date,
          "time" => time
        }
      ) do
    from = {
      String.to_float(fromLng),
      String.to_float(fromLat)
    }

    to = {
      String.to_float(toLng),
      String.to_float(toLat)
    }

    time = (time <> ":00") |> Time.from_iso8601!()

    query_date =
      date
      |> String.split("-")
      |> Enum.map(&Integer.parse/1)
      |> Enum.map(&elem(&1, 0))
      |> List.to_tuple()
      |> Date.from_erl!()

    transports_query_day =
      Linjebuss.list_transports(
        query_date |> Date.to_string() |> String.replace("-", ""),
        start_time: time,
        from: from,
        to: to
      )
      |> Enum.map(fn transport -> Map.put(transport, :date, Date.to_string(query_date)) end)

    transports_tomorrow =
      Linjebuss.list_transports(
        query_date |> Date.add(1) |> Date.to_string() |> String.replace("-", ""),
        end_time: time,
        from: from,
        to: to
      )
      |> Enum.map(fn transport ->
        Map.put(transport, :date, query_date |> Date.add(1) |> Date.to_string())
      end)

    render(conn, "index.json", transports: Enum.concat(transports_query_day, transports_tomorrow))
  end
end
