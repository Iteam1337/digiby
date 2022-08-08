defmodule Digiby.Adapters.Fardtjanst do
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
  def load_fardtjanst do
    Path.expand("./data/fardtjanst/arjeplog-2019.csv", File.cwd!())
    |> File.stream!(read_ahead: 10_000)
    |> NimbleCSV.RFC4180.parse_stream()
    |> Flow.from_enumerable(stages: 4)
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
        departure_time: departure_time,
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
      updated_trip =
        trip
        |> Map.put_new_lazy(:type, fn ->
          if is_sjukresa?(trip), do: "sjukresa", else: "fardtjanst"
        end)
        |> Map.update!(:from_street, &replace_sjukresa_sam_prefix/1)
        |> Map.update!(:from_street, &replace_other_sam_prefixes/1)
        |> Map.update!(:to_street, &replace_sjukresa_sam_prefix/1)
        |> Map.update!(:to_street, &replace_other_sam_prefixes/1)
        |> Map.drop([:line_nr])

      Map.put(
        updated_trip,
        :from_position,
        to_coord(updated_trip.from_street, updated_trip.from_municipality)
      )
      |> Map.put(:to_position, to_coord(updated_trip.to_street, updated_trip.to_municipality))
    end)
    |> Enum.take(1)
  end

  def to_coord(street_name, municipality) do
    %{lat: 13.23, lng: 12.45}
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
end
