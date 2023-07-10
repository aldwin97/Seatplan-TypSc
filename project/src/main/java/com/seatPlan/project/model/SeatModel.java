package com.seatPlan.project.model;

import java.time.LocalDateTime;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;


@Data
@AllArgsConstructor
@NoArgsConstructor
public class SeatModel {
    private  Long  seat_id;
    private Long user_id;
    private Long project_id;
    private Long seatstatus_id;
    private Long areaId;
    private int seatNumber;
    private int isDeleted;
    private LocalDateTime createdTime;
    private String createdBy;
    private LocalDateTime updatedTime;
    private String updatedBy;



    private String project_name;
    private String first_name;
    private String last_name;
    private String area_name;
     private String seatstatus_name;
}
