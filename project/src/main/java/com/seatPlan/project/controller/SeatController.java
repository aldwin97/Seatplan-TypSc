package com.seatPlan.project.controller;

import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.seatPlan.project.model.SeatModel;
import com.seatPlan.project.service.SeatService;

@RestController
@RequestMapping("/seat")
public class SeatController {
     private final SeatService seatService;

    public SeatController( @Autowired SeatService seatService) {
        this.seatService = seatService;
    }

    @GetMapping("/allSeat")
    public List<SeatModel> getAllSeats() {
        return seatService.getAllSeats();
    }


    @GetMapping("/showAllSeat")
    public List<Map<String, Object>> allSeat(){
        List<Map<String, Object>> seats = seatService.getAllSeat();
        return seats;
    }

    
}
