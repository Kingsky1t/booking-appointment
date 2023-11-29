import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth, db } from "../Auth/firebase";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import { collection, doc, getDoc, setDoc } from "firebase/firestore";
import "../assets/css/Login.css";

export const Login = () => {
    const navigate = useNavigate();
    const userCollectionRef = collection(db, "users");

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const [isUserRegistered, setIsUserRegistered] = useState(true);
    const [error, setError] = useState("");

    const addToUserDb = async (uid, email) => {
        await setDoc(doc(userCollectionRef, uid), {
            email,
            role: "undecided",
        });
    };

    const roleNavigate = async (uid) => {
        try {
            const userDoc = await getDoc(doc(userCollectionRef, uid));
            const user = userDoc.data();
            console.log(userDoc);
            if (!user) {
                navigate("/error", { state: "User document does not exist." });
            }
            const { role } = user;
            if (role === "admin") {
                navigate("/admin", { state: uid });
            } else if (role === "teacher") {
                navigate("/teacher", { state: uid });
            } else if (role === "student") {
                navigate("/student", { state: uid });
            } else {
                navigate("/approval", { state: uid });
            }
        } catch (error) {
            navigate("/error", { state: "Error fetching user data:" + error.message });
        }
    };

    const register = async () => {
        try {
            const cred = await createUserWithEmailAndPassword(auth, email, password);
            addToUserDb(cred.user.uid, cred.user.email);
        } catch (err) {
            setError(err.code);
        } finally {
            setEmail("");
            setPassword("");
            setIsUserRegistered(true);
        }
    };

    const login = async () => {
        setEmail("");
        setPassword("");
        try {
            const cred = await signInWithEmailAndPassword(auth, email, password);
            roleNavigate(cred.user.uid);
        } catch (err) {
            setError(err.code);
        }
    };

    return (
        <div className='login-container'>
            <div className='login-error'>{error}</div>
            <div className='login-form' id='register_user'>
                <label htmlFor=''>Email:</label>
                <input
                    type='email'
                    onChange={(e) => {
                        setEmail(e.target.value);
                    }}
                    value={email}
                />
                <label htmlFor=''>Password:</label>
                <input
                    type='password'
                    onChange={(e) => {
                        setPassword(e.target.value);
                    }}
                    value={password}
                />
                {isUserRegistered ? (
                    <button type='submit' onClick={login}>
                        Login
                    </button>
                ) : (
                    <button type='submit' onClick={register}>
                        Register
                    </button>
                )}
            </div>

            <div className='login-text'>
                {isUserRegistered ? (
                    <>
                        <p>Don't have an account?</p>
                        <span onClick={() => setIsUserRegistered((prev) => !prev)}>Register</span>
                    </>
                ) : (
                    <>
                        <p>Already have an account?</p>
                        <span onClick={() => setIsUserRegistered((prev) => !prev)}>Login</span>
                    </>
                )}
            </div>
        </div>
    );
};
