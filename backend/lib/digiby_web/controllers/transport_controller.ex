defmodule DigibyWeb.TransportController do
  use DigibyWeb, :controller

  alias Digiby.Linjebuss
  alias Digiby.Linjebuss.Transport

  action_fallback DigibyWeb.FallbackController

  def index(conn, _params) do
    transports = Linjebuss.list_transports()
    render(conn, "index.json", transports: transports)
  end

  def create(conn, %{"transport" => transport_params}) do
    with {:ok, %Transport{} = transport} <- Linjebuss.create_transport(transport_params) do
      conn
      |> put_status(:created)
      |> put_resp_header("location", Routes.transport_path(conn, :show, transport))
      |> render("show.json", transport: transport)
    end
  end

  def show(conn, %{"id" => id}) do
    transport = Linjebuss.get_transport!(id)
    render(conn, "show.json", transport: transport)
  end

  def update(conn, %{"id" => id, "transport" => transport_params}) do
    transport = Linjebuss.get_transport!(id)

    with {:ok, %Transport{} = transport} <- Linjebuss.update_transport(transport, transport_params) do
      render(conn, "show.json", transport: transport)
    end
  end

  def delete(conn, %{"id" => id}) do
    transport = Linjebuss.get_transport!(id)

    with {:ok, %Transport{}} <- Linjebuss.delete_transport(transport) do
      send_resp(conn, :no_content, "")
    end
  end
end
