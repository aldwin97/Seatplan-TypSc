package com.seatPlan.project.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.seatPlan.project.mapper.SeatMapper;
import com.seatPlan.project.model.SeatModel;

@Service
public class SeatService {
    private final SeatMapper seatMapper;

   
    public SeatService(@Autowired SeatMapper seatMapper) {
        this.seatMapper = seatMapper;
    }

    public List<SeatModel> getAllSeats() {
        return seatMapper.getAllSeats();
    }
}
