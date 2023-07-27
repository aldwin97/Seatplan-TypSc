package com.seatPlan.project.dao;

import java.util.List;

import org.apache.ibatis.annotations.Mapper;

import com.seatPlan.project.model.UserInputModel;
import com.seatPlan.project.model.UserModel;

@Mapper
public interface ProfileDao {

    List<UserModel> showUserById(Long user_id);

    UserModel getUserById(Long user_id);
    
    void updateUser(UserModel userModel);

    void updateUserPassword(UserModel userModel);

    UserInputModel getUserByEmail(String email, Long user_id);
    
}
