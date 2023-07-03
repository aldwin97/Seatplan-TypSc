package user;

import org.apache.ibatis.annotations.*;


@Mapper
public interface UserMapper {


    @Select("SELECT username, password FROM users_table")
    UserCredentials getUserCredentialsById(Long id);

}
