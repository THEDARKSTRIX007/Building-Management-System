package com.building.backend.controller;

import com.building.backend.model.*;
import com.building.backend.service.BuildingService;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/building")
@CrossOrigin("*")
public class BuildingController {

    private final BuildingService service;

    public BuildingController(BuildingService service) {
        this.service = service;
    }

    // GET building
    @GetMapping
    public Building getBuilding() {
        return service.getBuilding();
    }

    // Update building temperature
    @PostMapping("/temperature")
    public Building updateTemperature(@RequestBody TempRequest req) {
        service.setRequestedTemperature(req.requestedTemperature);
        return service.getBuilding();
    }

    static class TempRequest {
        public double requestedTemperature;
    }

    // ADD ROOM
    @PostMapping("/rooms")
    public Building addRoom(@RequestBody RoomRequest req) {

        if ("Apartment".equals(req.type)) {
            Apartment apt = new Apartment(req.id, req.temperature, req.ownerName);
            service.addRoom(apt);

        } else if ("CommonRoom".equals(req.type)) {
            CommonRoom.CommonType ct = CommonRoom.CommonType.valueOf(req.commonType);
            CommonRoom cr = new CommonRoom(req.id, req.temperature, ct);
            service.addRoom(cr);
        }

        return service.getBuilding();
    }

    // DELETE ROOM
    @DeleteMapping("/rooms/{id}")
    public Building deleteRoom(@PathVariable String id) {
        service.removeRoom(id);
        return service.getBuilding();
    }

    // UPDATE ROOM (EDIT)
    @PutMapping("/rooms/{id}")
    public Building updateRoom(@PathVariable String id, @RequestBody RoomUpdateRequest req) {
        service.updateRoom(id, req);
        return service.getBuilding();
    }

    // DTOs
    public static class RoomRequest {
        public String id;
        public double temperature;
        public String type;
        public String ownerName;
        public String commonType;
    }

    public static class RoomUpdateRequest {
        public double temperature;
        public String ownerName;
        public String commonType;
        public String type; // Apartment or CommonRoom
    }
}
