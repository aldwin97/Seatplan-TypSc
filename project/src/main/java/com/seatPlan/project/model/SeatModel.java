package com.seatPlan.project.model;

import java.time.LocalDateTime;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;


@Data
@AllArgsConstructor
@NoArgsConstructor
public class SeatModel {
    private  Long  seatId;
    private Long seatsStatusId;
    private String seatColor;
    private Long areaId;
    private int seatNumber;
    private Boolean isDeleted;
    private LocalDateTime createdTime;
    private String createdBy;
    private LocalDateTime updatedTime;
    private String updatedBy;

}
