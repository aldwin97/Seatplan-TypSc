package com.seatPlan.project.model;


import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;



@Data
@NoArgsConstructor
@AllArgsConstructor
public class ProjectInputModel {

   private String project_name;
   private Long color_id;
   private Long created_by;
    
}
