<<<<<<< HEAD
=======
package com.seatplanproj.seatplan.user;
>>>>>>> dce6e0f329a54436dec434336b9cbdaffbcedb5c


public class userModel {
    private Long id;
    private String username;
    private String password;

    public userModel() {
        // Default constructor
    }

    public userModel(Long id, String username, String password) {
        this.id = id;
        this.username = username;
        this.password = password;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }
}