import React, { useEffect, useState } from "react";
import { db } from "../Auth/firebase";
import { addDoc, collection, deleteDoc, doc, getDocs, setDoc, updateDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";

export const Admin = () => {
    const navigate = useNavigate();
    const approvalCollectionRef = collection(db, "approval");
    const teacherCollectionRef = collection(db, "teacher");
    const studentCollectionRef = collection(db, "student");
    const userCollectionRef = collection(db, "users");

    const [approvals, setApprovals] = useState([]);

    const getApprovalList = async () => {
        try {
            const data = (await getDocs(approvalCollectionRef)).docs;
            const filteredData = data.map((doc) => ({
                ...doc.data(),
                uid: doc.id,
            }));
            setApprovals(filteredData);
        } catch (err) {
            console.error(err);
        }
    };

    useEffect(() => {
        getApprovalList();
    }, []);

    const handleApprove = async (item) => {
        deleteApproval(item.uid);
        changeUserRole(item.uid, item.role);
        if (item.role === "teacher") {
            try {
                await setDoc(doc(teacherCollectionRef, item.uid), { name: item.name });
            } catch (err) {
                console.log(err);
            }
        } else if (item.role === "student") {
            try {
                await setDoc(doc(studentCollectionRef, item.uid), { name: item.name });
            } catch (err) {
                console.error(err);
            }
        }
    };

    const deleteApproval = async (uid) => {
        try {
            await deleteDoc(doc(db, "approval", uid));
            getApprovalList();
        } catch (err) {
            console.error(err);
        }
    };

    const changeUserRole = async (uid, r) => {
        try {
            await updateDoc(doc(userCollectionRef, uid), { role: r });
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <div>
            <div>
                <h2>Approval pending...</h2>
                <ul>
                    {approvals.map((item, idx) => (
                        <li key={idx}>
                            <p>Name: {item.name}</p>
                            <p>Role: {item.role}</p>
                            <button
                                onClick={() => {
                                    handleApprove(item);
                                }}>
                                Approve
                            </button>
                            <button
                                onClick={() => {
                                    deleteApproval(item.uid);
                                }}>
                                Decline
                            </button>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};
