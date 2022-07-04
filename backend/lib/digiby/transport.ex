defmodule Digiby.Transport do
  defstruct [
    :id,
    :line_number,
    :transportation_type,
    :travel_time,
    :cost,
    departure: %Position{},
    destination: %Position{},
    stops: [],
    geometry: []
  ]
end
