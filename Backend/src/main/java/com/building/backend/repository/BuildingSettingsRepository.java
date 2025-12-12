package com.building.backend.repository;

import com.building.backend.model.BuildingSettings;
import org.springframework.data.jpa.repository.JpaRepository;

public interface BuildingSettingsRepository extends JpaRepository<BuildingSettings, Long> {
}
