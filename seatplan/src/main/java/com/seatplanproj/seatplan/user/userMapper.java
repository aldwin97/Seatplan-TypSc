package com.seatplanproj.seatplan.user;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Select;

@Mapper
public interface userMapper {
    @Select("SELECT * FROM users_table WHERE username = #{username}")
    userModel findByUsername(String username);
}