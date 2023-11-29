import React, { useEffect, useState } from "react";
import { db } from "../Auth/firebase";
import { collection, deleteDoc, doc, getDocs, setDoc, updateDoc } from "firebase/firestore";
import { useLocation, useNavigate } from "react-router-dom";
import { HandleTeacher } from "./HandleTeacher";
import "../assets/css/Admin.css";
import { Logout } from "./Logout";
import { TeacherList } from "./TeacherList";
export const Admin = () => {
    const approvalCollectionRef = collection(db, "approval");
    const studentCollectionRef = collection(db, "student");
    const userCollectionRef = collection(db, "users");

    const [approvals, setApprovals] = useState([]);
    const [isOpen, setIsOpen] = useState(false);

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
        try {
            deleteApproval(item.uid);
            changeUserRole(item.uid, "student");
            await setDoc(doc(studentCollectionRef, item.uid), {
                name: item.name,
                email: item.email,
            });
        } catch (err) {
            console.error(err);
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
        <>
            <nav>
                <ul>
                    <li
                        onClick={() => {
                            setIsOpen((prev) => !prev);
                        }}>
                        Add Teacher
                    </li>
                    <li>
                        <Logout />
                    </li>
                </ul>
            </nav>
            <div className='admin-container'>
                <div>
                    <h2>Approval pending...</h2>
                    <ul>
                        {approvals.map((item, idx) => (
                            <li key={idx}>
                                <p>Name: {item.name}</p>
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

                <TeacherList />
                {isOpen && (
                    <div className='add-teacher-modal'>
                        <HandleTeacher />
                    </div>
                )}
            </div>
        </>
    );
};
