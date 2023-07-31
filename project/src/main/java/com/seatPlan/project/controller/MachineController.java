package com.seatPlan.project.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.seatPlan.project.model.MachineInputModel;
import com.seatPlan.project.model.MachineModel;
import com.seatPlan.project.service.MachineService;

@RestController
@RequestMapping("/machine")
public class MachineController {


     private final MachineService machineService;

    
    public MachineController(@Autowired MachineService machineService) {
        this.machineService = machineService;
    }
    

    @PostMapping("/insertNewMachine")
    public ResponseEntity<String> createMachine(@RequestBody MachineInputModel machineInputModel) {
        try {
            machineService.insertMachine(machineInputModel);
            return ResponseEntity.ok("Machine created successfully");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Failed to create machine");
        }
    }



    @GetMapping("/showAllMachine")
    public List<MachineModel> getAllMachine() {
        return machineService.getAllMachine();
    }


     @PostMapping("/delete/{machine_id}")
    public ResponseEntity<String> deleteMachineById(@PathVariable Long machine_id) {
          try {
              machineService.deleteMachineById(machine_id);
           return ResponseEntity.ok("Machine deleted successfully");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Failed to delete machine");
        }    
    }








}
