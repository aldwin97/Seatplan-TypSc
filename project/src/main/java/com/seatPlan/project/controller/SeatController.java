package com.seatPlan.project.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.seatPlan.project.model.SeatModel;
import com.seatPlan.project.service.SeatService;

@RestController
@RequestMapping("/api/seat")
public class SeatController {
     private final SeatService seatService;

   
    public SeatController( @Autowired SeatService seatService) {
        this.seatService = seatService;
    }

    @GetMapping
    public List<SeatModel> getAllSeats() {
        return seatService.getAllSeats();
    }
    
}
