package com.building.backend.model;

import com.fasterxml.jackson.annotation.JsonSubTypes;
import com.fasterxml.jackson.annotation.JsonTypeInfo;
import jakarta.persistence.*;

@JsonTypeInfo(
        use = JsonTypeInfo.Id.NAME,
        include = JsonTypeInfo.As.PROPERTY,
        property = "type"
)
@JsonSubTypes({
        @JsonSubTypes.Type(value = Apartment.class, name = "Apartment"),
        @JsonSubTypes.Type(value = CommonRoom.class, name = "CommonRoom")
})
@Entity
@Inheritance(strategy = InheritanceType.SINGLE_TABLE)
@DiscriminatorColumn(name = "room_type")
public abstract class Room {

    @Id
    private String id;

    private double temperature;
    private boolean heatingEnabled = false;
    private boolean coolingEnabled = false;

    public Room() {}

    public Room(String id, double temperature) {
        this.id = id;
        this.temperature = temperature;
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public double getTemperature() {
        return temperature;
    }

    public void setTemperature(double temperature) {
        this.temperature = temperature;
    }

    public boolean isHeatingEnabled() {
        return heatingEnabled;
    }

    public void setHeatingEnabled(boolean heatingEnabled) {
        this.heatingEnabled = heatingEnabled;
    }

    public boolean isCoolingEnabled() {
        return coolingEnabled;
    }

    public void setCoolingEnabled(boolean coolingEnabled) {
        this.coolingEnabled = coolingEnabled;
    }
}