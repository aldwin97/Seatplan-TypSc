package user;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Select;

@Mapper
public interface UserMapper {
    @Select("SELECT * FROM users_table WHERE username = #{username}")
    UserModel findByUsername(String username);
}

