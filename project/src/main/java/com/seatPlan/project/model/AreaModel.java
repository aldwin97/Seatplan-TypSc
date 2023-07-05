package com.seatPlan.project.model;

import java.time.LocalDateTime;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;



@Data
@AllArgsConstructor
@NoArgsConstructor
public class AreaModel {
    private Long areaId;
private String areaName;
private Boolean isDeleted;
private LocalDateTime createdTime;
private String createdBy;
private LocalDateTime updatedTime;
private String updatedBy;

}
