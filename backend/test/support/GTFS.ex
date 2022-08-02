defmodule Digiby.Test.GTFS do
  def get_buses(_) do
    Digiby.TripsFixture.get()
  end

  def get_geometry(_), do: []
end
