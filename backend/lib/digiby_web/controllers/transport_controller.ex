defmodule DigibyWeb.TransportController do
  use DigibyWeb, :controller

  alias Digiby.Linjebuss
  alias Digiby.Linjebuss.Transport

  action_fallback DigibyWeb.FallbackController

  def index(conn, _params) do
    transports = Linjebuss.list_transports()
    render(conn, "index.json", transports: transports)
  end
end
