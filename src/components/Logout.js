import React from "react";
import { auth } from "../Auth/firebase";
import { signOut } from "firebase/auth";
import { useNavigate } from "react-router-dom";

export const Logout = () => {
    const navigate = useNavigate();
    const logout = async () => {
        try {
            if (!auth.currentUser) {
                console.log("no user login");
                return;
            }
            await signOut(auth);
            console.log("user logout successful");
            navigate("/");
        } catch (err) {
            console.error(err);
        }
    };
    return <span className='logout-button' onClick={logout}>LogOut</span>;
};
