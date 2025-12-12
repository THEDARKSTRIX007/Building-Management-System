package com.building.backend.model;

import jakarta.persistence.*;

@Entity
@Table(name = "building_settings")
public class BuildingSettings {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "requested_temperature")
    private double requestedTemperature = 25.0;

    public BuildingSettings() {}

    public BuildingSettings(double requestedTemperature) {
        this.requestedTemperature = requestedTemperature;
    }

    public Long getId() { return id; }

    public double getRequestedTemperature() { return requestedTemperature; }
    public void setRequestedTemperature(double requestedTemperature) { this.requestedTemperature = requestedTemperature; }
}
