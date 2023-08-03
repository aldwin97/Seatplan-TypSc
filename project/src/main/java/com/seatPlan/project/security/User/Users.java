//package com.seatPlan.project.security.User;


// import java.util.Collection;
// import java.util.List;

// import org.springframework.security.core.GrantedAuthority;
// import org.springframework.security.core.userdetails.User;
// import org.springframework.security.core.userdetails.UserDetails;

// import com.seatplan.project.model.UserModel;

// public class Users extends UserModel implements UserDetails {
//     private List<GrantedAuthority> authorities;

//     public Users(UserModel users,List<GrantedAuthority> authorities){
//         super(users.getUsername(), users.getPassword());
//         this.authorities = authorities;
//     }

//     @Override
//     public Collection<? extends GrantedAuthority> getAuthorities() {
//       return authorities;
//     }

//     @Override
//     public String getUsername(){
//         return getUsername();
//     }

//     @Override
//     public boolean isAccountNonExpired(){
//         return true;
//     }

//     @Override
//     public boolean isAccountNonLocked(){
//         return true; 
//     }

//     @Override
//     public boolean isCredentialsNonExpired(){
//         return true;
//     }

//     @Override
//     public boolean isEnabled(){
//         return true;
//     }
// }
