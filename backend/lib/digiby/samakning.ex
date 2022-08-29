defmodule Digiby.Samakning do
  alias Digiby.Transport
  @max_extra_travel_time_for_fardtjanst 3600
  def list_transports(date, options) do
    _start_time = Keyword.get(options, :start_time, ~T[00:00:00])
    _end_time = Keyword.get(options, :end_time, ~T[23:59:59])

    query_from_position = Keyword.get(options, :from)
    query_to_position = Keyword.get(options, :to)

    Digiby.Adapters.Samakning.get_transports(date)
    |> Enum.filter(
      &filter_trips_too_far_from_original_trip(&1, query_from_position, query_to_position)
    )
    |> Enum.map(fn trip ->
      {query_from_lng, query_from_lat} = query_from_position
      {query_to_lng, query_to_lat} = query_to_position

      %{"duration" => duration, "geometry" => geometry} =
        Osrm.route(%{"lat" => query_from_lat, "lng" => query_from_lng}, %{
          "lat" => query_to_lat,
          "lng" => query_to_lng
        })

      %{"duration" => time_to_start} =
        Osrm.route(trip.departure.stop_position, %{
          "lat" => query_from_lat,
          "lng" => query_from_lng
        })

      first_stop =
        Map.new()
        |> Map.put(
          :arrival_time,
          trip.departure_time
          |> Time.add(round(time_to_start))
        )
        |> Map.put(:stop_position, %{"lat" => query_from_lat, "lng" => query_from_lng})

      last_stop =
        Map.new()
        |> Map.put(:stop_position, %{"lat" => query_from_lat, "lng" => query_from_lng})
        |> Map.put_new(
          :arrival_time,
          trip.departure_time
          |> Time.add(round(duration + time_to_start))
        )

      Map.put(trip, :travel_time, duration)
      |> Map.put(:geometry, Map.get(geometry, "coordinates"))
      |> Map.put(:departure, first_stop |> Map.put(:meters_from_query_to_stop, 0))
      |> Map.put(:destination, last_stop |> Map.put(:meters_from_query_to_stop, 0))
      |> Map.put(:stops, [first_stop, last_stop])
    end)
    |> Enum.map(&to_transport_struct/1)
  end

  def filter_trips_too_far_from_original_trip(
        %{
          departure: departure,
          destination: destination
        },
        query_from_position,
        query_to_position
      ) do
    {query_to_lng, query_to_lat} = query_to_position
    {query_from_lng, query_from_lat} = query_from_position

    before_duration =
      Osrm.route([departure.stop_position, destination.stop_position]) |> Map.get("duration")

    after_duration =
      Osrm.route([
        departure.stop_position,
        %{"lat" => query_from_lat, "lng" => query_from_lng},
        destination.stop_position,
        %{"lat" => query_to_lat, "lng" => query_to_lng}
      ])
      |> Map.get("duration")

    after_duration - before_duration < @max_extra_travel_time_for_fardtjanst
  end

  def to_transport_struct(trip) do
    %Transport{
      id: trip.id,
      line_number: nil,
      agency: "Privatperson",
      transportation_type: "Samåkning",
      vehicle_type: "3 seats",
      travel_time: trip.travel_time,
      cost: 900_000,
      departure: trip.departure,
      destination: trip.destination,
      stops: trip.stops,
      geometry: trip.geometry
    }
  end
end
