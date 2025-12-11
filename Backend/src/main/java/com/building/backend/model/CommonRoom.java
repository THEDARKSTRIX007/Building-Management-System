package com.building.backend.model;

public class CommonRoom extends Room {

    public enum CommonType { Gym, Library, Laundry }

    private CommonType type;

    public CommonRoom(String id, double temperature, CommonType type) {
        super(id, temperature);
        this.type = type;
    }

    public CommonType getType() { return type; }
    public void setType(CommonType type) { this.type = type; }
}
