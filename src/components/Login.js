import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import React, { useState } from "react";
import { auth, db } from "../Auth/firebase";
import "../assets/css/Login.css";
import { collection, doc, getDoc, setDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";

export const Login = () => {
    const navigate = useNavigate();
    const userCollectionRef = collection(db, "users");

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const [isUserRegistered, setIsUserRegistered] = useState(true);

    const addToUserDb = async (uid, email) => {
        await setDoc(doc(userCollectionRef, uid), {
            email,
            role: "undecided",
        });
    };

    // get data from users db and check role and navigate accordingly
    const roleNavigate = async (uid) => {
        try {
            const userDoc = await getDoc(doc(userCollectionRef, uid));
            const user = userDoc.data();
            console.log(userDoc)
            if (!user) {
                console.log("User document does not exist.");
                // navigate('/error');
                return;
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
            console.error("Error fetching user data:", error.message);
            //   navigate('/error');
        }
    };

    const register = async () => {
        try {
            const cred = await createUserWithEmailAndPassword(auth, email, password);
            addToUserDb(cred.user.uid, cred.user.email);
            // console.log(cred)
        } catch (err) {
            console.log(err.code);
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
            console.error(err.code);
        }
    };

    return (
        <>
            <div className='login-portal' id='register_user'>
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

            <p className='login-portal' onClick={() => setIsUserRegistered((prev) => !prev)}>
                {isUserRegistered
                    ? "Don't have an account? Register"
                    : "Already have an account? Login"}
            </p>
        </>
    );
};
