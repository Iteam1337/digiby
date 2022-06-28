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

    transports = Linjebuss.list_transports(String.replace(date, "-", ""), time <> ":00", from, to)

    render(conn, "index.json", transports: transports)
  end
end
