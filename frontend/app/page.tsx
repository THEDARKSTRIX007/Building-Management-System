"use client";

import { useEffect, useState, useMemo } from "react";
import AddRoomForm from "@/components/AddRoomForm";
import EditRoomModal from "@/components/EditRoomModal";
import toast from "react-hot-toast";
import { getBuilding, updateTemperature, deleteRoom } from "@/lib/api";

interface Room {
    id: string;
    temperature: number;
    heatingEnabled: boolean;
    coolingEnabled: boolean;
    ownerName?: string; 
    commonType?: string; 
    type: 'Apartment' | 'CommonRoom';
}

interface BuildingData {
    requestedTemperature: number;
    rooms: Room[];
}

const REFRESH_INTERVAL_MS = 5000;

export default function Home() {
  const [building, setBuilding] = useState<BuildingData | null>(null);
  const [loading, setLoading] = useState(false);
  const [editRoom, setEditRoom] = useState<Room | null>(null); 

  const [search, setSearch] = useState("");

  // === MOVED SEARCH FILTERING LOGIC TO THE TOP ===
  const filteredRooms = useMemo(() => {
    // Only filter if building data exists
    if (!building?.rooms) return [];
    
    const key = search.toLowerCase().trim();
    
    if (key === "") {
        return building.rooms;
    }

    return building.rooms.filter((room: Room) => {
        return (
            room.id.toLowerCase().includes(key) ||
            (room.ownerName && room.ownerName.toLowerCase().includes(key)) ||
            (room.commonType && room.commonType.toLowerCase().includes(key))
        );
    });
  }, [building, search]);
  // ===============================================

  async function load() {
    if (!building) setLoading(true); 
    try {
      const data: BuildingData = await getBuilding();
      setBuilding(data);
    } catch (error) {
      console.error("Failed to fetch building data:", error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  useEffect(() => {
    const intervalId = setInterval(() => {
      load();
    }, REFRESH_INTERVAL_MS);

    return () => clearInterval(intervalId);
  }, [building]);


  if (!building || loading) {
    return (
      <div className="flex justify-center p-10 text-gray-300">
        Loading...
      </div>
    );
  }
  
  const getRoomPrefix = (room: Room): string => {
    if (room.type === 'Apartment') {
      return 'Room';
    } else if (room.commonType) {
      return room.commonType;
    }
    return room.type;
  };

  return (
    <div className="max-w-7xl mx-auto p-8 space-y-12">

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

      <div className="grid grid-cols-1 md:grid-cols-3 gap-10">

        <AddRoomForm refresh={load} />

        <div className="border border-gray-700 p-6 rounded-xl bg-[#161b22] shadow-md">
          <h2 className="text-xl font-bold">Summary</h2>

          <p>Total Rooms: {building.rooms.length}</p>
          <p>Heating: {building.rooms.filter((r: Room) => r.heatingEnabled).length}</p> 
          <p>Cooling: {building.rooms.filter((r: Room) => r.coolingEnabled).length}</p> 
        </div>
      </div>

      <div>
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

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredRooms.map((room: Room) => (
            <div
              key={room.id}
              className="border border-gray-700 p-5 rounded-xl bg-[#161b22] shadow hover:shadow-xl transition"
            >
              <h3 className="text-xl font-semibold">
                {getRoomPrefix(room)} - {room.id}
              </h3>
              
              <p>Temperature: {room.temperature.toFixed(2)}°C</p>

              {room.ownerName && <p>Owner: {room.ownerName}</p>}
              {room.commonType && <p>Type: {room.commonType}</p>}

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