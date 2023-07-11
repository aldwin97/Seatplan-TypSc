package com.seatPlan.project.mapper;

import java.util.List;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Select;

import com.seatPlan.project.model.SeatModel;

@Mapper
public interface SeatMapper {

    @Select("SELECT * FROM table_seat")
    List<SeatModel> getAllSeats();
}
