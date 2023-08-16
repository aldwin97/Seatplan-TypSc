package com.seatPlan.project.dao;

import org.apache.ibatis.annotations.Mapper;
import com.seatPlan.project.model.UserTypeModel;


@Mapper
public interface UserTypeDao {

    UserTypeModel getUsertypeName(Long usertype_id);
}
