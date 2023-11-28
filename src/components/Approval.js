import React, { useEffect, useState } from "react";
import { auth, db } from "../Auth/firebase";
import { collection, doc, getDoc, setDoc } from "firebase/firestore";
import { useLocation } from "react-router-dom";

export const Approval = () => {
    const currUser = useLocation().state;
    const approvalCollectionRef = collection(db, "approval");
    const userCollectionRef = collection(db, "users");

    // User details
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [role, setRole] = useState("");
    const [loading, setLoading] = useState(true); 
    const [showForm, setShowForm] = useState(true);

    const submitApproval = async () => {
        try {
            await setDoc(doc(approvalCollectionRef, currUser), {
                name,
                email,
                role,
            });
            setShowForm(false);
        } catch (err) {
            console.error(err);
        } finally {
            setName("");
            setRole("");
        }
    };

    const getUser = async () => {
        try {
            const data = await getDoc(doc(userCollectionRef, currUser));
            setEmail(data.data().email);
        } catch (err) {
            console.error(err);
        }
    };

    const getApproval = async () => {
        try {
            const data = await getDoc(doc(approvalCollectionRef, currUser));
            console.log(data);
            if (data.exists()) {
                setShowForm(false);
            } else {
                setShowForm(true);
            }
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false); 
        }
    };

    useEffect(() => {
        getApproval();
        getUser();
    }, []);

    return (
        <div>
            {loading ? (
                <p>Loading...</p>
            ) : showForm ? (
                <div>
                    <h3>Authorize yourself</h3>
                    <label htmlFor=''>Name:</label>
                    <input
                        type='text'
                        onChange={(e) => {
                            setName(e.target.value);
                        }}
                        value={name}
                    />
                    <label htmlFor=''>Role</label>
                    <select
                        name='role'
                        onChange={(e) => {
                            setRole(e.target.value);
                        }}
                        value={role}>
                        <option value='' disabled>
                            Select...
                        </option>
                        <option value='teacher'>Teacher</option>
                        <option value='student'>Student</option>
                    </select>
                    <button onClick={submitApproval}>Submit</button>
                </div>
            ) : (
                <p>Please wait until Admin approves you</p>
            )}
        </div>
    );
};
