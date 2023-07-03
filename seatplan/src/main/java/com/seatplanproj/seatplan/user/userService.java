package com.seatplanproj.seatplan.user;

public interface UserService {
    boolean authenticateUser(String username, String password);
}
