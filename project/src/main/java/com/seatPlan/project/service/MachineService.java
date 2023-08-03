package com.seatPlan.project.service;

import java.util.List;

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

    public List<MachineModel> getAllMachine() {
        return machineDao.getAllMachine();
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


}
