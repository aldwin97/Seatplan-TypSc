package com.seatPlan.project.dao;

import java.util.List;

import org.apache.ibatis.annotations.Mapper;

import com.seatPlan.project.model.MachineInputModel;
import com.seatPlan.project.model.MachineModel;

@Mapper
public interface MachineDao {

    void insertMachine(MachineInputModel machineInputModel);

    List<MachineModel> getAllMachine();
    
    void deleteMachineById(Long user_id);

    MachineModel getMachineById(Long user_id);

    void updateMachine(MachineModel machineModel);

    void insertMultipleProject(long generatedUserId, List<Long> project_id);

    void deleteExistingProject(Long user_id);
}
