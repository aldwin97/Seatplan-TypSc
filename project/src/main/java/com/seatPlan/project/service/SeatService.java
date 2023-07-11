package com.seatPlan.project.service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.seatPlan.project.mapper.SeatMapper;
import com.seatPlan.project.model.SeatModel;
import com.seatPlan.project.model.StaffStatusModel;

@Service
public class SeatService {
    private final SeatMapper seatMapper;

   
    public SeatService(@Autowired SeatMapper seatMapper) {
        this.seatMapper = seatMapper;
    }

    public List<SeatModel> getAllSeats() {
        return seatMapper.getAllSeats();
    }

    public List<Map<String, Object>> getAllSeat() {
        List<SeatModel> seats = seatMapper.getAllSeatModels();
        List<Map<String, Object>> filteredSeat = seats.stream()
            .map(seat -> {
                Map<String, Object> seatMap = new HashMap<>();
                seatMap.put("seatNumber", seat.getSeat_num());
                seatMap.put("full_name", String.join(" ", seat.getFirst_name(), seat.getLast_name()));
                seatMap.put("area_name", seat.getArea_name());
                seatMap.put("project_name", seat.getProject_name()); 
                seatMap.put("seat_status", seat.getSeat_status());
                return seatMap;
            })
            .collect(Collectors.toList());
    
        return filteredSeat;
    }
    

     




}
