package com.seatPlan.project.service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.seatPlan.project.dao.MachineDao;
import com.seatPlan.project.model.MachineInputModel;
import com.seatPlan.project.model.MachineModel;

@Service
@Transactional
public class MachineService {



     public MachineDao machineDao;

    public MachineService(@Autowired(required=true) MachineDao machineDao) {
        this.machineDao = machineDao;
    }

    public void insertMachine(MachineInputModel machineInputModel) {
        machineDao.insertMachine(machineInputModel);
    }


    public List<Map<String, Object>> getAllMachine() {
        List<MachineModel> machines = machineDao.getAllMachine();

        List<Map<String, Object>> filteredMachine = machines.stream()
                .map(machine -> {
                    Map<String, Object> machineMap = new HashMap<>();
                    machineMap.put("user_id", machine.getUser_id());
                    machineMap.put("first_name", machine.getFirst_name());
                    machineMap.put("project_name",machine.getProject_name());
                    return machineMap;
                }).collect(Collectors.toList());
        return filteredMachine;
    }

    public void deleteMachineById(Long user_id) {
        machineDao.deleteMachineById(user_id);
    }


    public MachineModel getMachineById(Long user_id) {
        return machineDao.getMachineById(user_id);
    }
    
    public void updateMachine(MachineModel machineModel) {
        machineDao.updateMachine(machineModel);
    }


    public void insertMultipleProject(long generatedUserId, List<Long> project_id) {
        machineDao.insertMultipleProject(generatedUserId, project_id);
  }


}
