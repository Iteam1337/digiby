defmodule Digiby.LinjebussTest do
  use ExUnit.Case
  alias Digiby.Linjebuss
  @pajala_busstation {23.365724, 67.210854}
  @banjovagen {21.607435, 65.811768}
  @stockholms_stadshus {18.054305, 59.326797}

  describe "get best matches for trips" do
    @example_trips [
      %{
        line_number: "Linje 2",
        stop_times: [
          %{
            arrival_time: ~T[07:37:00],
            stop_position: %{
              lat: "65.811768",
              lng: "21.607435",
              name: "Banjovägen"
            }
          },
          %{
            arrival_time: ~T[07:38:05],
            stop_position: %{
              lat: "65.811434",
              lng: "21.594417",
              name: "Instrumentvägen Bod Tät"
            }
          },
          %{
            arrival_time: ~T[07:38:33],
            stop_position: %{
              lat: "65.812132",
              lng: "21.587642",
              name: "Hamptjärnmoran Spelv"
            }
          },
          %{
            arrival_time: ~T[10:00:00],
            stop_position: %{
              lat: "67.210854",
              lng: "23.365724",
              name: "Pajala Busstation"
            }
          }
        ],
        trip_id: "252500000000001211",
        geometry: []
      }
    ]
    test "finds trip with nearest bus stop start and bus stop end" do
      [{trip_id, bus_stop_start, bus_stop_end, "Linje 2"}] =
        Digiby.Linjebuss.get_best_matches_for_trips(
          @example_trips,
          @banjovagen,
          @pajala_busstation,
          ~T[00:05:00]
        )

      assert(trip_id == "252500000000001211")
      assert(bus_stop_start.arrival_time == ~T[07:37:00])
      assert(bus_stop_start.stop_position.name == "Banjovägen")
      assert(bus_stop_end.arrival_time == ~T[10:00:00])
      assert(bus_stop_end.stop_position.name == "Pajala Busstation")
    end

    test "removes trips when bus stop 'end' time is after bus stop 'start'" do
      time = ~T[00:00:00]

      res =
        Linjebuss.get_best_matches_for_trips(
          @example_trips,
          @pajala_busstation,
          @banjovagen,
          time
        )

      assert(res == [])
    end

    test "only returns trips that has both a legible bus stop 'start' and bus stop 'end'" do
      [] =
        Linjebuss.get_best_matches_for_trips(
          @example_trips,
          @stockholms_stadshus,
          @pajala_busstation,
          ~T[00:00:00]
        )

      [] =
        Linjebuss.get_best_matches_for_trips(
          @example_trips,
          @pajala_busstation,
          @stockholms_stadshus,
          ~T[00:00:00]
        )
    end
  end
end
