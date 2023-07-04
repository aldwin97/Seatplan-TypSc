package com.seatplanproj.seatplan.user;

import org.springframework.stereotype.Service;

@Service
public class userServiceImpl implements userService {
    private final userMapper userMapper;


    public userServiceImpl(userMapper userMapper) {
        this.userMapper = userMapper;
    }

    @Override
    public boolean authenticateUser(String username, String password) {
        userModel user = userMapper.findByUsername(username);
        if (user != null && user.getPassword().equals(password)) {
            return true;
        }
        return false;
    }
}
