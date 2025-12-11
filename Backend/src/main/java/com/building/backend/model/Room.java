package com.building.backend.model;

public class Room {
    private String id;
    private double temperature;
    private boolean heatingEnabled;
    private boolean coolingEnabled;

    public Room(String id, double temperature) {
        this.id = id;
        this.temperature = temperature;
    }

    public String getId() { return id; }
    public double getTemperature() { return temperature; }
    public boolean isHeatingEnabled() { return heatingEnabled; }
    public boolean isCoolingEnabled() { return coolingEnabled; }

    public void setTemperature(double temperature) { this.temperature = temperature; }
    public void setHeatingEnabled(boolean heatingEnabled) { this.heatingEnabled = heatingEnabled; }
    public void setCoolingEnabled(boolean coolingEnabled) { this.coolingEnabled = coolingEnabled; }
}
