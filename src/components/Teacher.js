import { addDoc, collection, doc, getDoc, getDocs, query, setDoc, where } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { db } from "../Auth/firebase";
import { useLocation } from "react-router-dom";

export const Teacher = () => {
    const uid = useLocation().state;
    const teacherCollectionRef = collection(db, "teacher");

    const getTeacherName = async () => {
        try {
            const teacher = (await getDoc(doc(teacherCollectionRef, uid))).data();
            setTeacherName(teacher.name);
        } catch (err) {
            console.error(err);
            return "Unknown Teacher";
        }
    };

    const [teacherName, setTeacherName] = useState("");
    const [pendingAppointmentList, setPendingAppointmentList] = useState([]);
    const [appointmentDate, setAppointmentDate] = useState(null);

    const appointmentCollectionRef = collection(db, "appointment");

    const handleSchedule = async () => {
        try {
          console.log({
            date: appointmentDate,
            teacherUid: uid,
            studentUid: null,
            teacherName,
            studentName: "",
            status: "scheduled",
        })
            await addDoc(appointmentCollectionRef, {
                date: appointmentDate,
                teacherUid: uid,
                studentUid: null,
                teacherName,
                studentName: "",
                status: "scheduled",
            });
        } catch (err) {
            console.error(err);
        }
    };

    const handleFetchAppointment = async () => {
        try {
            const data = (
                await getDocs(query(appointmentCollectionRef, where("status", "==", "booked")))
            ).docs;
            const filteredData = data.map((doc) => ({
                ...doc.data(),
                uid: doc.id,
            }));
            setPendingAppointmentList(filteredData);
        } catch (err) {
            console.error(err);
        }
    };

    useEffect(() => {
        handleFetchAppointment();
        getTeacherName();
    }, []);

    console.log(pendingAppointmentList);
    return (
        <>
            <div>
                <h1>Schedule appointment</h1>
                <div>
                    <label htmlFor=''>Appointment Date</label>
                    <input
                        type='date'
                        onChange={(e) => {
                            setAppointmentDate(e.target.value);
                        }}
                    />
                    <button type='submit' onClick={handleSchedule}>
                        Submit
                    </button>
                </div>
            </div>
            <div>
                <h1>Pending appointment</h1>
                <ul>
                    {pendingAppointmentList.map((item, idx) => (
                        <li key={idx}>Date:{item.date}</li>
                    ))}
                </ul>
            </div>
        </>
    );
};
