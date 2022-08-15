defmodule Osrm do
  def osrm_url, do: Application.fetch_env!(:digiby, :osrm_url)

  def route(from, to), do: route([from, to])

  def route(positions) do
    coordinates =
      positions
      |> Enum.map(fn %{"lat" => lat, "lng" => lon} -> Enum.join([lon, lat], ",") end)
      |> Enum.join(";")

    url =
      "#{osrm_url()}/route/v1/driving/#{coordinates}?steps=true&alternatives=false&overview=full&annotations=true"

    HTTPoison.get!(url)
    |> Map.get(:body)
    |> Jason.decode!()
    |> Map.get("routes")
    |> Enum.sort(fn a, b -> a["duration"] < b["duration"] end)
    |> List.first()
    |> Map.update!("geometry", &decode_polyline/1)
  end

  def decode_polyline(geometry) do
    %{
      "coordinates" => Polyline.decode(geometry) |> Enum.map(fn {lon, lat} -> [lon, lat] end)
    }
  end
end
