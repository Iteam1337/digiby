defmodule DigibyWeb.TransportController do
  use DigibyWeb, :controller

  alias Digiby.Linjebuss

  action_fallback(DigibyWeb.FallbackController)

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

    query_date = input_date_to_elixir_date(date)

    res =
      [
        {
          &Digiby.Fardtjanst.list_transports/2,
          query_date,
          [start_time: time, from: from, to: to]
        },
        {
          &Digiby.Fardtjanst.list_transports/2,
          query_date |> Date.add(1),
          [start_time: time, from: from, to: to]
        },
        {&Digiby.Samakning.list_transports/2, query_date, [from: from, to: to, start_time: time]},
        {&Digiby.Samakning.list_transports/2, query_date |> Date.add(1),
         [from: from, to: to, end_time: time]},
        {
          &Digiby.Linjebuss.list_transports/2,
          query_date,
          [
            start_time: time,
            from: from,
            to: to
          ]
        },
        {
          &Digiby.Linjebuss.list_transports/2,
          query_date |> Date.add(1),
          [
            start_time: time,
            from: from,
            to: to
          ]
        }
      ]
      |> Enum.flat_map(fn {fun, date, opt} ->
        fun.(date, opt)
        |> Enum.map(fn transports -> Map.put(transports, :date, date) end)
      end)
      |> Enum.sort_by(fn trip -> DateTime.new(trip.date, trip.departure.arrival_time) end)

    render(conn, "index.json", transports: res)
  end

  @doc """

  iex> input_date_to_elixir_date("2022-08-10")
  ~D[2022-08-10] 

  iex> input_date_to_elixir_date("2222-08-10")
  ~D[2222-08-10] 

  """
  def input_date_to_elixir_date(date),
    do:
      date
      |> String.split("-")
      |> Enum.map(&Integer.parse/1)
      |> Enum.map(&elem(&1, 0))
      |> List.to_tuple()
      |> Date.from_erl!()
end
