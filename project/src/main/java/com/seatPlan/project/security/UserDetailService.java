package com.seatPlan.project.security;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Component;

import com.seatPlan.project.mapper.UserMapper;
import com.seatPlan.project.model.UserModel;



@Component
public class UserDetailService implements  UserDetailsService {

    private UserMapper userMapper;

      
    public UserDetailService(@Autowired UserMapper userMapper) {
        this.userMapper = userMapper;
    }



   @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        UserModel user = userMapper.findByUsername(username);
        if (user == null) {
            throw new UsernameNotFoundException("No user found");
        }
        return new UserDetail(user);
    }
    
}
