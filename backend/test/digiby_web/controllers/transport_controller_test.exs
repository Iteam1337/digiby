defmodule DigibyWeb.TransportControllerTest do
  use DigibyWeb.ConnCase

  import Digiby.LinjebussFixtures

  alias Digiby.Linjebuss.Transport

  @create_attrs %{
    arrivaltime: ~U[2022-06-13 14:34:00Z],
    cost: 42,
    departure_time: ~U[2022-06-13 14:34:00Z],
    route_id: "some route_id",
    transportation_type: "some transportation_type",
    travel_time: 42
  }
  @update_attrs %{
    arrivaltime: ~U[2022-06-14 14:34:00Z],
    cost: 43,
    departure_time: ~U[2022-06-14 14:34:00Z],
    route_id: "some updated route_id",
    transportation_type: "some updated transportation_type",
    travel_time: 43
  }
  @invalid_attrs %{arrivaltime: nil, cost: nil, departure_time: nil, route_id: nil, transportation_type: nil, travel_time: nil}

  setup %{conn: conn} do
    {:ok, conn: put_req_header(conn, "accept", "application/json")}
  end

  describe "index" do
    test "lists all transports", %{conn: conn} do
      conn = get(conn, Routes.transport_path(conn, :index))
      assert json_response(conn, 200)["data"] == []
    end
  end

  describe "create transport" do
    test "renders transport when data is valid", %{conn: conn} do
      conn = post(conn, Routes.transport_path(conn, :create), transport: @create_attrs)
      assert %{"id" => id} = json_response(conn, 201)["data"]

      conn = get(conn, Routes.transport_path(conn, :show, id))

      assert %{
               "id" => ^id,
               "arrivaltime" => "2022-06-13T14:34:00Z",
               "cost" => 42,
               "departure_time" => "2022-06-13T14:34:00Z",
               "route_id" => "some route_id",
               "transportation_type" => "some transportation_type",
               "travel_time" => 42
             } = json_response(conn, 200)["data"]
    end

    test "renders errors when data is invalid", %{conn: conn} do
      conn = post(conn, Routes.transport_path(conn, :create), transport: @invalid_attrs)
      assert json_response(conn, 422)["errors"] != %{}
    end
  end

  describe "update transport" do
    setup [:create_transport]

    test "renders transport when data is valid", %{conn: conn, transport: %Transport{id: id} = transport} do
      conn = put(conn, Routes.transport_path(conn, :update, transport), transport: @update_attrs)
      assert %{"id" => ^id} = json_response(conn, 200)["data"]

      conn = get(conn, Routes.transport_path(conn, :show, id))

      assert %{
               "id" => ^id,
               "arrivaltime" => "2022-06-14T14:34:00Z",
               "cost" => 43,
               "departure_time" => "2022-06-14T14:34:00Z",
               "route_id" => "some updated route_id",
               "transportation_type" => "some updated transportation_type",
               "travel_time" => 43
             } = json_response(conn, 200)["data"]
    end

    test "renders errors when data is invalid", %{conn: conn, transport: transport} do
      conn = put(conn, Routes.transport_path(conn, :update, transport), transport: @invalid_attrs)
      assert json_response(conn, 422)["errors"] != %{}
    end
  end

  describe "delete transport" do
    setup [:create_transport]

    test "deletes chosen transport", %{conn: conn, transport: transport} do
      conn = delete(conn, Routes.transport_path(conn, :delete, transport))
      assert response(conn, 204)

      assert_error_sent 404, fn ->
        get(conn, Routes.transport_path(conn, :show, transport))
      end
    end
  end

  defp create_transport(_) do
    transport = transport_fixture()
    %{transport: transport}
  end
end
