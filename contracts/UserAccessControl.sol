// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract UserAccessControl {
    enum UserRole { Donor, Beneficiary, NGO }

    struct User {
        UserRole role;
        bool isRegistered;
    }

    mapping(address => User) public users;
    address public admin;

    event UserRegistered(address indexed user, UserRole role);

    constructor() {
        admin = msg.sender;
    }

    modifier onlyAdmin {
        require(msg.sender == admin, "Not authorized");
        _;
    }

    function registerUser(address user, UserRole role) public onlyAdmin {
        require(!users[user].isRegistered, "User already registered");
        users[user] = User(role, true);
        emit UserRegistered(user, role);
    }

   
    function isUserRegistered(address user) public view returns (bool) {
        return users[user].isRegistered;
    }

    function getUserRole(address user) public view returns (UserRole) {
        require(users[user].isRegistered, "User not registered.");
        return users[user].role;



        
    }

    function setUser(address user, UserRole role) public {
        require(!users[user].isRegistered, "User already registered");
        users[user] = User(role, true);
        emit UserRegistered(user, role);
    }

}