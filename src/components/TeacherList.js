import { collection, getDocs } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { db } from "../Auth/firebase";

export const TeacherList = () => {
    const teacherCollectionRef = collection(db, "teacher");
    const [teacherList, setTeacherList] = useState([]);
    const fetchTeacherList = async () => {
        try {
            const list = (await getDocs(teacherCollectionRef)).docs;
            const updatedList = list.map((doc) => ({
                ...doc.data(),
                uid: doc.id,
            }));
            setTeacherList(updatedList);
        } catch (err) {
            console.log(err);
        }
    };
    useEffect(() => {
        fetchTeacherList();
    }, []);
    
    return (
        <div className='teacher-list'>
            <h2>Teachers List</h2>
            <ul>
                {teacherList.map((item) => (
                    <li >
                        <p>Name: {item.name}</p>
                        <p>Email: {item.email}</p>
                        <button>Update</button>
                        <button>Delete</button>
                    </li>
                ))}
            </ul>
        </div>
    );
};
