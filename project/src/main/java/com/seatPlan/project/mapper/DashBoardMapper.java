package com.seatPlan.project.mapper;

import java.util.List;
import java.util.Map;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Select;

import com.seatPlan.project.model.UserModel;

@Mapper
public interface DashBoardMapper {


     @Select("SELECT COUNT(*) FROM table_user WHERE is_deleted = 0")
    int countUser();
    
     @Select("SELECT COUNT(*) FROM table_seat WHERE seatstatus_id = 1 AND is_deleted = 0")
    int countSeatAvailable();

    @Select("SELECT COUNT(*) FROM table_user WHERE staffstatus_id = 1")
    int countTrainee();

    @Select("SELECT COUNT(*) FROM table_user WHERE staffstatus_id = 2")
    int countRegular();

    @Select("SELECT COUNT(*) FROM table_seat WHERE seatstatus_id = 2 AND is_deleted = 0")
    int countOccupied();

    @Select("SELECT COUNT(*) FROM table_seat WHERE seatstatus_id = 3 AND is_deleted = 0")
    int countUnderMaintenance();
    
    
}
