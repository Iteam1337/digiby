defmodule Digiby.Adapters.Pelias do
  # @pelias_url "https://pelias.iteam.services/v1"
  @pelias_url "https://pelias.iteamdev.io/v1"
  def structured_search(street, municipality) do
    HTTPoison.get!(
      @pelias_url <>
        "/search/structured?address=#{URI.encode(street)}&locality=#{URI.encode(municipality)}"
    )
    |> Map.get(:body)
    |> Jason.decode!()
  end

  def search(search_string) do
    HTTPoison.get!(
      @pelias_url <>
        "/search?text=#{URI.encode(search_string)}"
    )
    |> Map.get(:body)
    |> Jason.decode!()
  end
end
