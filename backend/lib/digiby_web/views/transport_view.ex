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
    route_id: "43",
    transportation_type: "länstrafiken Norrbotten", 
    travel_time: 45,
    departure: %{
      arrives_at: DateTime.from_naive!(~N[2022-06-13 06:10:00], "Europe/Stockholm", Tzdata.TimeZoneDatabase),
      position: %{lat: 66.4321345,lng: 20.6023657},
      stop_name: "Voullerim 6000",
    },
    destination: %{
      arrives_at: DateTime.from_naive!(~N[2022-06-13 06:55:00], "Europe/Stockholm", Tzdata.TimeZoneDatabase),
      stop_name: "Jokkmokk Busstation",
      position: %{lat: 66.6079861, lng: 19.8272512},
    },
    cost: 93,
    stops: [],
    geometry: []
  }
    # %{
    #   route_id: transport.route_id,
    #   transportation_type: transport.transportation_type,
    #   travel_time: transport.travel_time,
    #   departure: %{
    #     arrives_at: transport.departure.arrives_at,
    #     position: transport.departure.position,
    #     stop_name: transport.departure.position,
    #   },
    #   destination: %{
    #     arrives_at: transport.destination.arrives_at,
    #     position: transport.destination.position,
    #     stop_name: transport.destination.position,
    #   },
    #   cost: transport.cost
    # }
  end
end
