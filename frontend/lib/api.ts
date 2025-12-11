const BASE_URL =
  process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8080";

export async function getBuilding() {
  const res = await fetch(`${BASE_URL}/api/building`);
  return res.json();
}

export async function updateTemperature(temp: number) {
  const res = await fetch(`${BASE_URL}/api/building/temperature`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ requestedTemperature: temp }),
  });
  return res.json();
}

export async function addRoom(body: any) {
  const res = await fetch(`${BASE_URL}/api/building/rooms`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  return res.json();
}

export async function deleteRoom(id: string) {
  const res = await fetch(`${BASE_URL}/api/building/rooms/${id}`, {
    method: "DELETE",
  });
  return res.json();
}

export async function updateRoom(id: string, body: any) {
  const res = await fetch(`${BASE_URL}/api/building/rooms/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  return res.json();
}
