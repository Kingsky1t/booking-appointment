import { collection, doc, getDoc, getDocs, query, updateDoc, where } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { db } from "../Auth/firebase";

export const Student = () => {
    const uid = useLocation().state;
    const [studentName, setStudentName] = useState("");
    const studentCollectionRef = collection(db, "student");

    const appointmentCollectionRef = collection(db, "appointment");

    const [scheduledAppointmentList, setScheduledAppointmentList] = useState([]);

    const handleFetchAppointment = async () => {
        try {
            const data = (
                await getDocs(query(appointmentCollectionRef, where("status", "==", "scheduled")))
            ).docs;
            const filteredData = data.map((doc) => ({
                ...doc.data(),
                uid: doc.id,
            }));
            setScheduledAppointmentList(filteredData);
        } catch (err) {
            console.error(err);
        }
    };

    const queryStudent = async () => {
        try {
            const teacher = (await getDoc(doc(studentCollectionRef, uid))).data();
            setStudentName(teacher.name);
            return teacher.name;
        } catch (err) {
            console.error(err);
        }
    };

    useEffect(() => {
        handleFetchAppointment();
        queryStudent();
    }, []);

    const handleBookAppointment = async (docId) => {
        try {
            await updateDoc(doc(appointmentCollectionRef, docId), {
                studentName,
                studentUid: uid,
                status: "booked",
            });
        } catch (err) {
            console.log(err);
        }
    };
    console.log(scheduledAppointmentList)
    return (
        <div>
            <div>
                <h1>Scheduled appointment</h1>
                <ul>
                    {scheduledAppointmentList.map((item, idx) => (
                        <li key={idx}>
                            {item.date}
                            <br />
                            Teacher: {item.teacherName}
                            <button
                                onClick={() => {
                                    handleBookAppointment(item.uid);
                                }}>
                                Schedule
                            </button>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};
