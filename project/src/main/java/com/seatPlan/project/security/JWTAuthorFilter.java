//package com.seatPlan.project.security;


// import java.io.IOException;

// import com.seatplan.project.security.TokenUtils;

// import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
// import org.springframework.security.core.context.SecurityContextHolder;
// import org.springframework.stereotype.Component;
// import org.springframework.web.filter.OncePerRequestFilter;

// import javax.servlet.FilterChain;
// import javax.servlet.ServletException;
// import javax.servlet.http.HttpServletRequest;
// import javax.servlet.http.HttpServletResponse;

// @Component
// public class JWTAuthorFilter extends OncePerRequestFilter {
//     @Override
//     protected void doFilterInternal(
//         HttpServletRequest request,
//         HttpServletResponse response,
//         FilterChain filterChain)throws ServletException, IOException{
            

//             String bearerToken = request.getHeader("Authorization");
//             if (bearerToken !=null && bearerToken.startsWith("Bearer ")){
//                 String token = bearerToken.replace("Bearer ","");
//                 UsernamePasswordAuthenticationToken usernamePAT = TokenUtils.getAuthentication(token);
//                 SecurityContextHolder.getContext().setAuthentication(usernamePAT);
//             }
//             filterChain.doFilter(request, response);    
//         }
    
// }
