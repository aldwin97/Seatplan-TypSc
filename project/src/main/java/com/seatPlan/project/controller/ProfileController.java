package com.seatPlan.project.controller;

import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.seatPlan.project.service.ProfileService;


@RestController
@RequestMapping("/profile")
public class ProfileController {


     private final ProfileService profileService;

    
    public ProfileController(@Autowired ProfileService profileService) {
        this.profileService = profileService;
    }
    
    @GetMapping("/showLogedUserInfo/{user_id}")
    public List<Map<String, Object>> showUserById(@PathVariable ("user_id") Long user_id  ) {
            List<Map<String, Object>> userInfo = profileService.showUserById(user_id);
            return userInfo;
    }





}
