package com.seatPlan.project.controller;

import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.seatPlan.project.model.MachineInputModel;
import com.seatPlan.project.model.MachineModel;
import com.seatPlan.project.service.MachineService;

@RestController
@RequestMapping("/machine")
@PreAuthorize("hasRole('Admin','Editor')")
public class MachineController {

     @Autowired
     private  MachineService machineService;
   

    @PostMapping("/insertNewMachine")
    public ResponseEntity<String> createMachine(@RequestBody MachineInputModel machineInputModel) {
        try {
            machineService.insertMachine(machineInputModel);
            long generatedUserId = machineInputModel.getUser_id();
            machineService.insertMultipleProject(generatedUserId, machineInputModel.getProject_id());
            return ResponseEntity.ok("Machine created successfully");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Failed to create machine");
        }
    }



    @GetMapping("/showAllMachine")
    public List<Map<String, Object>> getAllMachine(){
        List<Map<String, Object>> machine = machineService.getAllMachine();
        return machine;
    }


    @PostMapping("/delete/{user_id}")
    public ResponseEntity<String> deleteMachineById(@PathVariable Long user_id) {
          try {
              machineService.deleteMachineById(user_id);
           return ResponseEntity.ok("Machine deleted successfully");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Failed to delete machine");
        }    
    }



     @PutMapping("/updateMachine/{user_id}")
    public ResponseEntity<String> updateMachineInfo(@PathVariable("user_id") Long user_id, @RequestBody MachineModel machineModel) {
    try {
        MachineModel existingMachine = machineService.getMachineById(user_id);
        if (existingMachine == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Machine not found");
        }


        if (machineModel.getFirst_name() != null) {
            existingMachine.setFirst_name(machineModel.getFirst_name());
        }

        if (machineModel.getProject_id() != null) {
             existingMachine.setProject_id(machineModel.getProject_id());

            machineService.deleteExistingProject(user_id);
            machineService.insertMultipleProject(user_id,existingMachine.getProject_id());
        }

        if (machineModel.getUpdated_by() != null) {
            existingMachine.setUpdated_by(machineModel.getUpdated_by());
        }

        machineService.updateMachine(existingMachine);
        return ResponseEntity.ok("Machine updated successfully");

    } catch (Exception e) {
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Failed to update machine");
    }
}








}
