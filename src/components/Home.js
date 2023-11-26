import React, { useState } from "react";
import { auth, db } from "../Auth/firebase";
import { collection, doc, setDoc } from "firebase/firestore";

export const Home = () => {
    const [name, setName] = useState("");
    const [role, setRole] = useState("");

    const [thanks, setThanks] = useState(false);

    const approvalCollectionRef = collection(db, "approval");
    const submitApproval = async () => {
        try {
            await setDoc(doc(approvalCollectionRef, auth.currentUser.uid), {
                name,
                role,
            });
            setThanks(true);
        } catch (err) {
            console.error(err);
        } finally {
            setName("");
            setRole("");
        }
    };

    return (
        <div>
            {thanks ? (
                <p>Please wait until Admin approves you</p>
            ) : (
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
            )}
        </div>
    );
};
