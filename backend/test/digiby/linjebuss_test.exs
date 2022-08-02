defmodule Digiby.LinjebussTest do
  use ExUnit.Case
  alias Digiby.Linjebuss
  @pajala_busstation {23.365724, 67.210854}
  @banjovagen {21.607435, 65.811768}
  @stockholms_stadshus {18.054305, 59.326797}
  @hallbacken_arj {16.973312, 66.241083}
  @arjeplog_busstation {17.897508, 66.052749}

  describe "get best matches for trips" do
    test "finds trip with nearest bus stop start and bus stop end" do
      %Digiby.Transport{
        geometry: g,
        departure: departure,
        destination: destination,
        stops: stops,
        line_number: "102"
      } =
        Digiby.Linjebuss.list_transports(
          "",
          start_time: ~T[15:15:00],
          from: @arjeplog_busstation,
          to: @hallbacken_arj
        )
        |> List.first()

      assert not is_nil(g)
      assert departure.stop_position.name == "Arjeplog Busstation"
      assert departure.arrival_time < destination.arrival_time
      assert destination.stop_position.name == "Hällbacken_Arj"
      assert List.first(stops).stop_position.name == "Arjeplog Busstation"
      assert List.last(stops).stop_position.name == "Hällbacken_Arj"
    end

    test "returns empty list if destination is out of range" do
      [] =
        Digiby.Linjebuss.list_transports(
          "",
          start_time: ~T[15:15:00],
          from: @arjeplog_busstation,
          to: @stockholms_stadshus
        )
    end

    test "returns empty list if start point is out of range" do
      [] =
        Digiby.Linjebuss.list_transports(
          "",
          start_time: ~T[15:15:00],
          from: @stockholms_stadshus,
          to: @arjeplog_busstation
        )
    end
  end
end
