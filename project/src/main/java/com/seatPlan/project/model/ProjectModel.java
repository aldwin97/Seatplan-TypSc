//Kenneth Christian B. Gutierrez
package com.seatPlan.project.model;

import java.time.LocalDateTime;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;



@Data
@AllArgsConstructor
@NoArgsConstructor
public class ProjectModel {
   private Long project_id;
   private String project_name;
   private Long color_id;
   private int is_deleted;
   private LocalDateTime created_time;
   private Long created_by;
   private LocalDateTime updated_time;
   private Long updated_by;
   private String color_code;

   private Long seatCount;
}
