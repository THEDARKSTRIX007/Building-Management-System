package com.building.backend.model;

import java.util.ArrayList;
import java.util.List;

public class Building {

    private double requestedTemperature = 20.0;
    private List<Room> rooms = new ArrayList<>();

    public double getRequestedTemperature() {
        return requestedTemperature;
    }

    public void setRequestedTemperature(double requestedTemperature) {
        this.requestedTemperature = requestedTemperature;
    }

    public List<Room> getRooms() {
        return rooms;
    }

    public void addRoom(Room room) {
        rooms.add(room);
    }

    public void removeRoom(String id) {
        rooms.removeIf(r -> r.getId().equals(id));
    }
}
