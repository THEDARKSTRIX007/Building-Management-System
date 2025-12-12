"use client";

import { useState } from "react";
import { addRoom } from "@/lib/api";
import toast from "react-hot-toast";

interface AddRoomFormProps {
  refresh: () => void;
}

interface RoomCreateBody {
  id: string;
  temperature: number;
  type: "Apartment" | "CommonRoom";
  ownerName?: string;
  commonType?: string;
}

export default function AddRoomForm({ refresh }: AddRoomFormProps) {
  const [id, setId] = useState("");
  const [temperature, setTemperature] = useState<number | string>(20);
  const [type, setType] = useState<"Apartment" | "CommonRoom">("Apartment");
  const [ownerName, setOwnerName] = useState("");
  const [commonType, setCommonType] = useState<"Gym" | "Library" | "Laundry">("Gym");

  const isValid = (): boolean => {
    if (!id.trim()) return false;
    if (temperature === "" || isNaN(Number(temperature))) return false;
    if (type === "Apartment" && !ownerName.trim()) return false;
    return true;
  };

  async function handleSubmit() {
    if (!isValid()) {
      toast.error("Please fill all required fields");
      return;
    }

    const body: RoomCreateBody = {
      id,
      temperature: Number(temperature),
      type,
    };

    if (type === "Apartment") {
      body.ownerName = ownerName;
    } else {
      body.commonType = commonType;
    }

    await addRoom(body);
    toast.success("Room added!");

    refresh(); 

    setId("");
    setOwnerName("");
    setTemperature(20);
    setType("Apartment");
    setCommonType("Gym");
  }

  return (
    <div className="border border-gray-700 p-6 rounded-xl bg-[#161b22] shadow-lg space-y-4">
      <h2 className="text-xl font-bold">Add Room</h2>

      <input
        className="border border-gray-600 p-3 w-full rounded bg-[#0d1117]"
        placeholder="Room ID"
        value={id}
        onChange={(e) => setId(e.target.value)}
      />

      <input
        className="border border-gray-600 p-3 w-full rounded bg-[#0d1117]"
        type="number"
        value={temperature}
        onChange={(e) => setTemperature(Number(e.target.value))}
      />

      <select
        className="border border-gray-600 p-3 w-full rounded bg-[#0d1117]"
        value={type}
        onChange={(e) => setType(e.target.value as "Apartment" | "CommonRoom")}
      >
        <option value="Apartment">Apartment</option>
        <option value="CommonRoom">Common Room</option>
      </select>

      {type === "Apartment" ? (
        <input
          className="border border-gray-600 p-3 w-full rounded bg-[#0d1117]"
          placeholder="Owner Name"
          value={ownerName}
          onChange={(e) => setOwnerName(e.target.value)}
        />
      ) : (
        <select
          className="border border-gray-600 p-3 w-full rounded bg-[#0d1117]"
          value={commonType}
          onChange={(e) => setCommonType(e.target.value as "Gym" | "Library" | "Laundry")}
        >
          <option value="Gym">Gym</option>
          <option value="Library">Library</option>
          <option value="Laundry">Laundry</option>
        </select>
      )}

      <button
        disabled={!isValid()}
        onClick={handleSubmit}
        className={`w-full py-2 rounded
          ${isValid() ? "bg-green-600 hover:bg-green-700" : "bg-gray-500 cursor-not-allowed"}
        `}
      >
        Add Room
      </button>
    </div>
  );
}