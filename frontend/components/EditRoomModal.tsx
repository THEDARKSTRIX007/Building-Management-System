"use client";

import { useState } from "react";
import { updateRoom } from "@/lib/api";
import toast from "react-hot-toast";

export default function EditRoomModal({ room, close, refresh }: any) {
  const [temperature, setTemperature] = useState(room.temperature);
  const [ownerName, setOwnerName] = useState(room.ownerName || "");
  const [commonType, setCommonType] = useState(room.commonType || "Gym");

  async function handleSave() {
    await updateRoom(room.id, {
      temperature,
      ownerName: room.type === "Apartment" ? ownerName : undefined,
      commonType: room.type === "CommonRoom" ? commonType : undefined,
      type: room.type,
    });

    toast.success("Room updated!");
    refresh();
    close();
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
      <div className="bg-[#161b22] border border-gray-700 p-6 rounded-xl w-96 space-y-4">

        <h2 className="text-xl font-bold text-gray-100">Edit Room {room.id}</h2>

        <input
          type="number"
          className="border border-gray-600 p-2 w-full rounded bg-[#0d1117]"
          value={temperature}
          onChange={(e) => setTemperature(Number(e.target.value))}
        />

        {room.ownerName && (
          <input
            className="border border-gray-600 p-2 w-full rounded bg-[#0d1117]"
            placeholder="Owner Name"
            value={ownerName}
            onChange={(e) => setOwnerName(e.target.value)}
          />
        )}

        <button
          onClick={handleSave}
          className="w-full bg-blue-600 py-2 rounded hover:bg-blue-700"
        >
          Save Changes
        </button>

        <button
          onClick={close}
          className="w-full bg-gray-600 py-2 rounded hover:bg-gray-700"
        >
          Cancel
        </button>

      </div>
    </div>
  );
}
