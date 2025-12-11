"use client";

import { useEffect, useState } from "react";
import AddRoomForm from "@/components/AddRoomForm";
import EditRoomModal from "@/components/EditRoomModal";
import toast from "react-hot-toast";
import { getBuilding, updateTemperature, deleteRoom } from "@/lib/api";

export default function Home() {
  const [building, setBuilding] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [editRoom, setEditRoom] = useState<any>(null);

  const [search, setSearch] = useState("");

  async function load() {
    setLoading(true);
    const data = await getBuilding();
    setBuilding(data);
    setLoading(false);
  }

  useEffect(() => {
    load();
  }, []);

  if (!building || loading) {
    return (
      <div className="flex justify-center p-10 text-gray-300">
        Loading...
      </div>
    );
  }

  // SIMPLE SEARCH FILTER (Room ID OR Owner Name)
  const filteredRooms = building.rooms.filter((room: any) => {
    const key = search.toLowerCase();
    return (
      room.id.toLowerCase().includes(key) ||
      room.ownerName?.toLowerCase().includes(key)
    );
  });

  return (
    <div className="max-w-7xl mx-auto p-8 space-y-12">

      {/* BUILDING STATUS */}
      <div className="border border-gray-700 p-6 rounded-xl bg-[#161b22] shadow-md w-full">
        <h1 className="text-2xl font-bold">Building Status</h1>

        <p className="mt-2 text-gray-300">
          Requested Temperature:{" "}
          <span className="text-white">{building.requestedTemperature}°C</span>
        </p>

        <div className="mt-4 flex gap-4">
          <button
            onClick={async () => {
              await updateTemperature(building.requestedTemperature + 1);
              toast.success("Temperature increased");
              load();
            }}
            className="px-4 py-2 bg-blue-600 rounded hover:bg-blue-700"
          >
            + Increase
          </button>

          <button
            onClick={async () => {
              await updateTemperature(building.requestedTemperature - 1);
              toast.success("Temperature decreased");
              load();
            }}
            className="px-4 py-2 bg-red-600 rounded hover:bg-red-700"
          >
            - Decrease
          </button>
        </div>
      </div>

      {/* GRID: ADD ROOM + SUMMARY */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-10">

        <AddRoomForm refresh={load} />

        {/* SUMMARY */}
        <div className="border border-gray-700 p-6 rounded-xl bg-[#161b22] shadow-md">
          <h2 className="text-xl font-bold">Summary</h2>

          <p>Total Rooms: {building.rooms.length}</p>
          <p>Heating: {building.rooms.filter((r: any) => r.heatingEnabled).length}</p>
          <p>Cooling: {building.rooms.filter((r: any) => r.coolingEnabled).length}</p>
        </div>
      </div>

      {/* ROOMS SECTION */}
      <div>
        {/* Title + Search Bar */}
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold">Rooms</h2>

          <input
            type="text"
            placeholder="Search by Room ID or Owner"
            className="p-2 rounded bg-[#0d1117] border border-gray-600 w-64"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {/* ROOM CARDS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredRooms.map((room: any) => (
            <div
              key={room.id}
              className="border border-gray-700 p-5 rounded-xl bg-[#161b22] shadow hover:shadow-xl transition"
            >
              <h3 className="text-xl font-semibold">{room.id}</h3>
              <p>Temperature: {room.temperature}°C</p>

              {room.ownerName && <p>Owner: {room.ownerName}</p>}
              {room.type && <p>Type: {room.type}</p>}

              <p
                className={
                  room.heatingEnabled
                    ? "text-orange-400"
                    : room.coolingEnabled
                    ? "text-blue-400"
                    : "text-gray-400"
                }
              >
                Status:{" "}
                {room.heatingEnabled
                  ? "Heating"
                  : room.coolingEnabled
                  ? "Cooling"
                  : "Neutral"}
              </p>

              <div className="mt-3 flex gap-2">
                <button
                  className="px-3 py-1 rounded bg-yellow-600 hover:bg-yellow-700"
                  onClick={() => setEditRoom(room)}
                >
                  Edit
                </button>

                <button
                  className="px-3 py-1 rounded bg-red-600 hover:bg-red-700"
                  onClick={async () => {
                    const ok = confirm(`Delete room ${room.id}?`);
                    if (!ok) return;

                    await deleteRoom(room.id);
                    toast.success("Room deleted");
                    load();
                  }}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {editRoom && (
        <EditRoomModal
          room={editRoom}
          close={() => setEditRoom(null)}
          refresh={load}
        />
      )}
    </div>
  );
}
