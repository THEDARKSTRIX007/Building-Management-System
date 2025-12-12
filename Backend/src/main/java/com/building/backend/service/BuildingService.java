package com.building.backend.service;

import com.building.backend.model.*;
import com.building.backend.repository.BuildingSettingsRepository;
import com.building.backend.repository.RoomRepository;
import jakarta.annotation.PostConstruct;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.Random;

@Service
@Transactional
public class BuildingService {

    private final RoomRepository roomRepository;
    private final BuildingSettingsRepository settingsRepository;
    private final Random random = new Random();

    private final double DEFAULT_TOLERANCE = 0.5;
    private final double DRIFT_RATE = 0.2;

    public BuildingService(RoomRepository roomRepository,
                           BuildingSettingsRepository settingsRepository) {
        this.roomRepository = roomRepository;
        this.settingsRepository = settingsRepository;
    }

    @PostConstruct
    public void initIfEmpty() {

        if (settingsRepository.count() == 0) {
            settingsRepository.save(new BuildingSettings(25.0));
        }

        if (roomRepository.count() == 0) {
            roomRepository.save(new Apartment("101", randomTemp(), "Owner A"));
            roomRepository.save(new Apartment("102", randomTemp(), "Owner B"));

            roomRepository.save(new CommonRoom("199", randomTemp(), "Gym"));
            roomRepository.save(new CommonRoom("201", randomTemp(), "Library"));

            updateStatuses();
        }
    }

    private double randomTemp() {
        return 10 + random.nextInt(31);
    }

    @Scheduled(fixedRate = 10000)
    public void recalculateAndDrift() {
        System.out.println("--- Scheduled Recalculation and Drift Running ---");

        List<Room> rooms = roomRepository.findAll();
        for (Room r : rooms) {
            double currentTemp = r.getTemperature();
            double newTemp = currentTemp;

            if (r.isHeatingEnabled()) {
                newTemp += DRIFT_RATE;
            } else if (r.isCoolingEnabled()) {
                newTemp -= DRIFT_RATE;
            }

            r.setTemperature(newTemp);
            roomRepository.save(r);
        }

        updateStatuses();
    }

    public BuildingSettings getBuildingSettings() {
        return settingsRepository.findAll().stream()
                .findFirst()
                .orElseGet(() -> settingsRepository.save(new BuildingSettings(25.0)));
    }

    public List<Room> getAllRooms() {
        return roomRepository.findAll();
    }

    public void addRoom(Room room) {
        if (room.getTemperature() == 0) {
            room.setTemperature(randomTemp());
        }
        roomRepository.save(room);
        updateStatuses();
    }

    public void removeRoom(String id) {
        roomRepository.deleteById(id);
        updateStatuses();
    }

    public Room updateRoom(String id, RoomUpdateRequest req) {
        Optional<Room> found = roomRepository.findById(id);
        if (found.isEmpty()) return null;

        Room r = found.get();

        if (req.temperature != null) r.setTemperature(req.temperature);

        if (r instanceof Apartment a && req.ownerName != null) {
            a.setOwnerName(req.ownerName);
        }

        if (r instanceof CommonRoom c && req.commonType != null) {
            c.setCommonType(req.commonType);
        }

        Room saved = roomRepository.save(r);
        updateStatuses();
        return saved;
    }

    public void setRequestedTemperature(double temp) {
        BuildingSettings s = getBuildingSettings();
        s.setRequestedTemperature(temp);
        settingsRepository.save(s);
        updateStatuses();
    }

    public void updateStatuses() {
        double target = getBuildingSettings().getRequestedTemperature();

        List<Room> rooms = roomRepository.findAll();
        for (Room r : rooms) {
            double t = r.getTemperature();
            double diff = Math.abs(t - target);

            if (diff <= DEFAULT_TOLERANCE) {
                r.setHeatingEnabled(false);
                r.setCoolingEnabled(false);
            } else {
                r.setHeatingEnabled(t < target);
                r.setCoolingEnabled(t > target);
            }
            roomRepository.save(r);
        }
    }

    public static class RoomUpdateRequest {
        public Double temperature;
        public String ownerName;
        public String commonType;
    }

    public static class RoomCreateRequest {
        public String type;
        public String id;
        public Double temperature;
        public String ownerName;
        public String commonType;
    }
}