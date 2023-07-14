//Kenneth Christian B. Gutierrez
package com.seatPlan.project.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ColorModel {
    private Long color_id;
    private String color_name;
    private String color_code;

}
