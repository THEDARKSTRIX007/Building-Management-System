package com.building.backend.service;

import com.building.backend.controller.BuildingController.RoomUpdateRequest;
import com.building.backend.model.*;
import org.springframework.stereotype.Service;

import java.util.Random;

@Service
public class BuildingService {

    private final Building building = new Building();
    private final Random random = new Random();

    public BuildingService() {
        initializeBuilding();
    }

    private void initializeBuilding() {
        building.setRequestedTemperature(25.0);

        building.addRoom(new Apartment("101", randomTemp(), "Owner A"));
        building.addRoom(new Apartment("102", randomTemp(), "Owner B"));

        building.addRoom(new CommonRoom("Gym", randomTemp(), CommonRoom.CommonType.Gym));
        building.addRoom(new CommonRoom("Library", randomTemp(), CommonRoom.CommonType.Library));

        updateStatuses();
    }

    private double randomTemp() {
        return 10 + random.nextInt(31);
    }

    public Building getBuilding() {
        return building;
    }

    public void addRoom(Room room) {
        building.addRoom(room);
        updateStatuses();
    }

    public void removeRoom(String id) {
        building.removeRoom(id);
        updateStatuses();
    }

    // EDIT ROOM LOGIC
    public void updateRoom(String id, RoomUpdateRequest req) {

        Room room = building.getRooms()
                .stream()
                .filter(r -> r.getId().equals(id))
                .findFirst()
                .orElse(null);

        if (room == null) return;

        room.setTemperature(req.temperature);

        // Update apartment fields
        if (room instanceof Apartment && req.ownerName != null) {
            ((Apartment) room).setOwnerName(req.ownerName);
        }

        // Update common room type
        if (room instanceof CommonRoom && req.commonType != null) {
            ((CommonRoom) room).setType(CommonRoom.CommonType.valueOf(req.commonType));
        }

        updateStatuses();
    }

    public void updateStatuses() {
        double target = building.getRequestedTemperature();

        for (Room r : building.getRooms()) {
            double t = r.getTemperature();
            r.setHeatingEnabled(t < target);
            r.setCoolingEnabled(t > target);
        }
    }

    public void setRequestedTemperature(double temp) {
        building.setRequestedTemperature(temp);
        updateStatuses();
    }
}
