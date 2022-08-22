defmodule Digiby.Adapters.Fardtjanst do
  alias Digiby.Adapters.Pelias

  @sjukrese_prefix %{
    "HC" => "hälsocentral",
    "SJ" => "sjukhus",
    # ex. PL SENSIA SPEC VÅRD
    "PL" => "privat läkare",
    # ex. SGYM REHABCENTRUM
    "SGYM" => "sjukgymnastik",
    # ex. TV TANDLAGET
    "TV" => "tandvård",
    # ex. TV FTV MJÖLKUDDEN
    "TV FTV" => "folktandvård",
    # .	ex. DSK MOTT TÄRENDÖ
    "DSK" => "distriktssköterskemott",
    # ex. FOTV FOTKLINIKEN
    "FOTV" => "fotvårdsterapeut"
  }
  @prefix %{
    # 	ex. HP NUS,
    "HP" => "hållplats",
    # 	ex. BSTN LULEÅ
    "BSTN" => "busstation",
    # 	ex FLP GÄLLIVARE
    "FLP" => "flygplats",
    # 	ex JVSTN BODEN
    "JVSTN" => "järnvägsstation",
    # 	ex. OPT SYNOPTIK 
    "OPT" => "optiker",
    # ex. DAGV GRÄNDEN
    "DAGV" => "dagverksamhet"
  }

  def get_transports(date) do
    :ets.lookup(:fardtjanst, date)
    |> List.first()
    |> elem(1)
  end

  def load_fardtjanst do
    table_name = :fardtjanst
    :ets.new(table_name, [:set, :public, :named_table])
    {:ok, file} = File.read("./data/fardtjanst/arjeplog-2019.json")

    file
    |> Jason.decode!()
    |> Enum.group_by(fn %{"departure_day" => day} -> day end)
    |> Enum.each(fn e -> :ets.insert(table_name, e) end)
  end

  def convert_to_json do
    new_file = File.open!("./data/fardtjanst/arjeplog-2019.json", [:utf8, :write])
    IO.write(new_file, "[")

    Path.expand("./data/fardtjanst/arjeplog-2019.csv", File.cwd!())
    |> File.stream!(read_ahead: 10_000)
    |> NimbleCSV.RFC4180.parse_stream()
    |> Flow.from_enumerable(stages: 5)
    |> Flow.map(fn [
                     departure_day,
                     departure_time,
                     car_type,
                     _place,
                     _,
                     from_street,
                     from_municipality,
                     _,
                     to_street,
                     to_municipality,
                     _,
                     line_nr
                   ] ->
      %{
        departure_day: departure_day,
        departure_time: departure_time <> ":00",
        car_type: car_type,
        from_street: from_street,
        from_municipality: from_municipality,
        to_street: to_street,
        to_municipality: to_municipality,
        line_nr: line_nr
      }
    end)
    # disregard anropastyrda liner for now, since they're present in the GTFS data dump
    |> Flow.filter(fn trip -> trip.line_nr == "0" end)
    |> Flow.map(fn trip ->
      trip
      |> Map.put_new_lazy(:type, fn ->
        if is_sjukresa?(trip), do: "Sjukresa", else: "Färdtjänst"
      end)
      |> Map.update!(:from_street, &replace_sjukresa_sam_prefix/1)
      |> Map.update!(:from_street, &replace_other_sam_prefixes/1)
      |> Map.update!(:to_street, &replace_sjukresa_sam_prefix/1)
      |> Map.update!(:to_street, &replace_other_sam_prefixes/1)
      |> Map.put_new_lazy(:id, &generate_id/0)
      |> Map.drop([:line_nr])
    end)
    |> Flow.map(fn trip ->
      Map.put(
        trip,
        :from_position,
        to_coord(trip.from_street, trip.from_municipality)
      )
      |> Map.put(:to_position, to_coord(trip.to_street, trip.to_municipality))
    end)
    |> Flow.map(fn trip ->
      Map.update!(trip, :departure_day, fn date ->
        [month, day, year] = String.split(date, "/") |> Enum.map(&String.to_integer/1)
        Date.from_erl!({year, month, day})
      end)
    end)
    |> Flow.map(fn trip ->
      IO.write(new_file, Jason.encode!(trip) <> ",\n")
    end)
    |> Enum.take(5)

    IO.write(new_file, "]")
  end

  def search_for_coordinates(search_strings) do
    {:ok, pid} = Task.Supervisor.start_link()

    Enum.map(search_strings, fn str ->
      Task.Supervisor.async_nolink(pid, fn -> Pelias.search(str) end)
    end)
    |> Enum.map(&Task.yield(&1, 50_000))
    |> Enum.map(fn
      {:ok, res} -> res
      _ -> %{}
    end)
    |> Enum.map(fn res -> Map.get(res, "features") end)
    |> Enum.reject(&is_nil/1)
    |> List.first()
  end

  def to_coord(street_name, municipality) do
    res =
      Pelias.structured_search(street_name <> " 1", municipality)
      |> Map.get("features")

    res =
      if res == [],
        do:
          search_for_coordinates([
            street_name <> " 1 " <> municipality,
            street_name <> municipality,
            street_name <> " 1 "
          ]),
        else: res

    pos =
      res
      |> List.first(%{})
      |> Map.get("geometry", %{})
      |> Map.get("coordinates", [])

    %{lng: Enum.at(pos, 0, nil), lat: Enum.at(pos, 1, nil)}
  end

  def is_sjukresa?(%{from_street: from_street, to_street: to_street}) do
    keys = Map.keys(@sjukrese_prefix)

    Enum.any?(keys, fn prefix -> String.starts_with?(from_street, prefix) end) ||
      Enum.any?(keys, fn prefix -> String.starts_with?(to_street, prefix) end)
  end

  def replace_sjukresa_sam_prefix(str) do
    Enum.find_value(
      @sjukrese_prefix,
      str,
      fn {prefix, value} ->
        if String.starts_with?(str, prefix),
          do: String.replace(str, Regex.compile!("^" <> prefix <> " "), value <> " ")
      end
    )
  end

  def replace_other_sam_prefixes(str) do
    Enum.find_value(
      @prefix,
      str,
      fn {prefix, value} ->
        if String.starts_with?(str, prefix),
          do: String.replace(str, Regex.compile!("^" <> prefix <> " "), value <> " ")
      end
    )
  end

  defp generate_id() do
    min = String.to_integer("100000", 36)
    max = String.to_integer("ZZZZZZ", 36)

    max
    |> Kernel.-(min)
    |> :rand.uniform()
    |> Kernel.+(min)
    |> Integer.to_string(36)
  end
end
