//Kenneth Christian B. Gutierrez
package com.seatPlan.project.dao;

import java.util.List;


import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import com.seatPlan.project.model.UserModel;

@Mapper
public interface UserDao {


    // output all the data in table 
    List<UserModel> getAllUsers();

    UserModel getUserByUsername(String username);
    // count the row of the table
    int countUsers();


    void deleteUserByUsername(@Param("username") String username);


    UserModel findByUsername(String username);


    void updateUser(UserModel userModel);


    UserModel getUserById(Long user_id);

    
    Object getUserByEmail(String email);


    List<UserModel> showUserById(Long user_id);
    
    


    


}
