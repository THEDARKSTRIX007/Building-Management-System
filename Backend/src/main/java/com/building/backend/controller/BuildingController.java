package com.building.backend.controller;

import com.building.backend.model.Apartment;
import com.building.backend.model.BuildingSettings;
import com.building.backend.model.CommonRoom;
import com.building.backend.model.Room;
import com.building.backend.service.BuildingService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api")
public class BuildingController {

    private final BuildingService buildingService;

    public BuildingController(BuildingService buildingService) {
        this.buildingService = buildingService;
    }

    @GetMapping(value = "/building", produces = "application/json")
    public ResponseEntity<Map<String, Object>> getBuilding() {
        BuildingSettings settings = buildingService.getBuildingSettings();
        List<Room> rooms = buildingService.getAllRooms();

        Map<String, Object> resp = new HashMap<>();
        resp.put("requestedTemperature", settings.getRequestedTemperature());
        resp.put("rooms", rooms);
        return ResponseEntity.ok(resp);
    }

    @PostMapping("/building/temperature")
    public ResponseEntity<?> setRequestedTemperature(@RequestBody Map<String, Object> body) {
        Object v = body.get("requestedTemperature");
        if (v instanceof Number) {
            double t = ((Number) v).doubleValue();
            buildingService.setRequestedTemperature(t);
            return ResponseEntity.ok().build();
        }
        return ResponseEntity.badRequest().body("requestedTemperature missing or invalid");
    }

    @PostMapping("/building/rooms")
    public ResponseEntity<?> addRoom(@RequestBody BuildingService.RoomCreateRequest req) {

        if (req.id == null || req.id.isBlank()) {
            return ResponseEntity.badRequest().body("id is required");
        }

        Room r;

        if ("CommonRoom".equalsIgnoreCase(req.type)) {
            r = new CommonRoom(
                    req.id,
                    req.temperature == null ? 20.0 : req.temperature,
                    req.commonType == null ? "General" : req.commonType
            );
        } else {
            r = new Apartment(
                    req.id,
                    req.temperature == null ? 20.0 : req.temperature,
                    req.ownerName == null ? "Unknown" : req.ownerName
            );
        }

        buildingService.addRoom(r);
        return ResponseEntity.ok().build();
    }


    @DeleteMapping("/building/rooms/{id}")
    public ResponseEntity<?> deleteRoom(@PathVariable String id) {
        buildingService.removeRoom(id);
        return ResponseEntity.ok().build();
    }

    @PutMapping("/building/rooms/{id}")
    public ResponseEntity<?> updateRoom(@PathVariable String id, @RequestBody Map<String, Object> body) {
        BuildingService.RoomUpdateRequest req = new BuildingService.RoomUpdateRequest();
        if (body.containsKey("temperature") && body.get("temperature") != null) {
            req.temperature = ((Number) body.get("temperature")).doubleValue();
        }
        if (body.containsKey("ownerName")) req.ownerName = (String) body.get("ownerName");
        if (body.containsKey("commonType")) req.commonType = (String) body.get("commonType");

        Room updated = buildingService.updateRoom(id, req);
        if (updated == null) return ResponseEntity.notFound().build();
        return ResponseEntity.ok().build();
    }
}