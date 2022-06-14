defmodule Transport do

   defstruct [:route_id, :transportation_type, :travel_time, :cost, departure: %Position{}, destination: %Position{}, ]

end
