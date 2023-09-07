package com.seatPlan.project;

import org.mybatis.spring.annotation.MapperScan;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.builder.SpringApplicationBuilder;
import org.springframework.boot.web.servlet.support.SpringBootServletInitializer;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.transaction.annotation.EnableTransactionManagement;

@SpringBootApplication
@MapperScan("com.seatPlan.project.dao")
@ComponentScan("com.seatPlan.project")
@EnableTransactionManagement
public class ProjectApplication extends SpringBootServletInitializer{

	public static void main(String[] args) {
		SpringApplication.run(ProjectApplication.class, args);
	}

		@Override
	protected SpringApplicationBuilder configure(SpringApplicationBuilder application) {
	  return application.sources(ProjectApplication.class);
	}

	
}
