package com.building.backend.model;

public class Apartment extends Room {
    private String ownerName;

    public Apartment(String id, double temperature, String ownerName) {
        super(id, temperature);
        this.ownerName = ownerName;
    }

    public String getOwnerName() { return ownerName; }
    public void setOwnerName(String ownerName) { this.ownerName = ownerName; }
}
