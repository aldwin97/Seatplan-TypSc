package com.seatPlan.project.model;



import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;


@Data
@AllArgsConstructor
@NoArgsConstructor
public class MachineInputModel {

   
    private String first_name;
    private List<Long> project_id;
    private Long user_id;
    private Long created_by;
    private Long updated_by;
    
}
