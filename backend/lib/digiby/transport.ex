defmodule Digiby.Transport do
  defstruct [
    :id,
    :line_number,
    :transportation_type,
    :travel_time,
    :cost,
    :agency,
    :vehicle_type,
    departure: %Position{},
    destination: %Position{},
    stops: [],
    geometry: []
  ]
end
