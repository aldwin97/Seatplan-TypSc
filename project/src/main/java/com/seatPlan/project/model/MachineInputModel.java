package com.seatPlan.project.model;




import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;


@Data
@AllArgsConstructor
@NoArgsConstructor
public class MachineInputModel {

    private String machine_name;
    private Long project_id;
    private Long created_by;
    
}
