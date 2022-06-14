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
    %{
      id: transport.id,
      route_id: transport.route_id,
      transportation_type: transport.transportation_type,
      travel_time: transport.travel_time,
      departure_time: transport.departure_time,
      arrivaltime: transport.arrivaltime,
      cost: transport.cost
    }
  end
end
