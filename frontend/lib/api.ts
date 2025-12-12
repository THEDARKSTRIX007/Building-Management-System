const BASE_URL =
  process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8080";

async function handleResponse(res: Response) {
  if (res.status === 204 || res.headers.get("Content-Length") === "0") {
    return {}; 
  }
  if (!res.ok) {
    const errorBody = await res.json().catch(() => ({}));
    throw new Error(errorBody.message || `API call failed with status ${res.status}`);
  }
  return res.json();
}

export async function getBuilding() {
  const res = await fetch(`${BASE_URL}/api/building`);
  return handleResponse(res); 
}

export async function updateTemperature(temp: number) {
  const res = await fetch(`${BASE_URL}/api/building/temperature`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ requestedTemperature: temp }),
  });
  return handleResponse(res); 
}

export async function addRoom(body: any) {
  const res = await fetch(`${BASE_URL}/api/building/rooms`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  return handleResponse(res); 
}

export async function deleteRoom(id: string) {
  const res = await fetch(`${BASE_URL}/api/building/rooms/${id}`, {
    method: "DELETE",
  });
  return handleResponse(res); 
}

export async function updateRoom(id: string, body: any) {
  const res = await fetch(`${BASE_URL}/api/building/rooms/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  return handleResponse(res); 
}