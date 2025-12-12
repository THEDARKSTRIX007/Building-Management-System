package com.building.backend.model;

import jakarta.persistence.DiscriminatorValue;
import jakarta.persistence.Entity;

@Entity
@DiscriminatorValue("CommonRoom")
public class CommonRoom extends Room {

    private String commonType;

    public CommonRoom() {}

    public CommonRoom(String id, double temperature, String commonType) {
        super(id, temperature);
        this.commonType = commonType;
    }

    public String getCommonType() { return commonType; }
    public void setCommonType(String t) { this.commonType = t; }

    public String getType() {
        return "CommonRoom";
    }
}
