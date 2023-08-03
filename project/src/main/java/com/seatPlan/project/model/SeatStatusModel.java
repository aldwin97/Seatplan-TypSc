//Kenneth Christian B. Gutierrez
package com.seatPlan.project.model;

import java.time.LocalDateTime;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;



@Data
@AllArgsConstructor
@NoArgsConstructor
public class SeatStatusModel {
    private Long seatstatus_id;
    private String seat_status;
    private int is_deleted;
    private LocalDateTime created_time;
    private Long created_by;
    private LocalDateTime updated_time;
    private Long updated_by;



}
