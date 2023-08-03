//Kenneth Christian B. Gutierrez
package com.seatPlan.project.model;

import java.time.LocalDateTime;

import org.apache.ibatis.type.Alias;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Alias("position_table")
public class PositionModel {
    private Long position_id;
    private String position_name;
    private int is_deleted;
    private LocalDateTime created_time;
    private Long created_by;
    private LocalDateTime updated_time;
    private Long updated_by;
}
