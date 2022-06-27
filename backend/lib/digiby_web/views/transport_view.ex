defmodule DigibyWeb.TransportView do
  use DigibyWeb, :view
  alias DigibyWeb.TransportView

  def render("index.json", %{transports: transports}) do
    %{data: render_many(transports, TransportView, "transport.json")}
  end

  def render("show.json", %{transport: transport}) do
    %{data: render_one(transport, TransportView, "transport.json")}
  end

  def render("transport.json", %{transport: transport}) do
    Map.from_struct(transport)
  end
end
