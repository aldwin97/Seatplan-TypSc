package com.seatPlan.project.mapper;

import java.util.List;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Select;

import com.seatPlan.project.model.SeatModel;
import com.seatPlan.project.model.StaffStatusModel;

@Mapper
public interface SeatMapper {

    @Select("SELECT * FROM table_seat")
    List<SeatModel> getAllSeats();


    @Select("SELECT ts.*, COALESCE(tu.first_name, 'No') AS first_name, " +
    "COALESCE(tu.last_name, 'User') AS last_name, ta.area_name, " +
    "COALESCE(tu.project_id, 0) AS project_id, COALESCE(tp.project_name, 'No Project') AS project_name, " +
    "COALESCE(tss.seat_status, 'No Seat Status') AS seat_status " +
    "FROM table_seat ts " +
    "LEFT JOIN table_user tu ON ts.user_id = tu.user_id " +
    "LEFT JOIN table_area ta ON ts.area_id = ta.area_id " +
    "LEFT JOIN table_project tp ON tu.project_id = tp.project_id " +
    "LEFT JOIN table_seatstatus tss ON ts.seatstatus_id = tss.seatstatus_id")
List<SeatModel> getAllSeatModels();



    
    
    
}
