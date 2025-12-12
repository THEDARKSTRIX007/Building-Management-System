package com.building.backend.model;

import com.building.backend.model.Room;
import jakarta.persistence.DiscriminatorValue;
import jakarta.persistence.Entity;

@Entity
@DiscriminatorValue("Apartment")
public class Apartment extends Room {

    private String ownerName;

    public Apartment() {}

    public Apartment(String id, double temperature, String ownerName) {
        super(id, temperature);
        this.ownerName = ownerName;
    }

    public String getOwnerName() { return ownerName; }
    public void setOwnerName(String ownerName) { this.ownerName = ownerName; }

    public String getType() {
        return "Apartment";
    }
}
