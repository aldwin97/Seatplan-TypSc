package com.seatPlan.project.controller;

import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.seatPlan.project.service.EditProfileService;

@RestController
@RequestMapping("/api/ediProfile")
public class EditProfileController {
    
private EditProfileService editProfileService;

    // public EditProfileController (@Autowired EditProfileService editProfileService){
    //     this.editProfileService = editProfileService;
    // }

    // @GetMapping("/showAllAvailableSeat")
    // public List<Map<String, Object>> allProject(){
    //     List<Map<String, Object>> seats = editProfileService.getAllAvailableSeat();
    //     return seats;
    // }



}
