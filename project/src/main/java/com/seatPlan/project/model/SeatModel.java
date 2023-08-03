//Kenneth Christian B. Gutierrez
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
    private Long seatstatus_id;
    private Long area_id;
    private int isDeleted;
    private LocalDateTime created_time;
    private Long created_by;
    private LocalDateTime updated_time;
    private Long updated_by;
    private Long position_x;
    private Long position_y;

    //For joint table
    private String project_name;
    private String first_name;
    private String last_name;
    private String area_name;
    private String seat_status;
    private String color_code;
    private String position_name;
}
