import React, { useState } from "react";
import { auth, db } from "../Auth/firebase";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { addDoc, collection, doc, setDoc } from "firebase/firestore";

export const HandleTeacher = () => {
  const userCollectionRef = collection(db, "users");
  const teacherCollectionRef = collection(db, "teacher");

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  const createUser = async () => {
    try {
      const cred = await createUserWithEmailAndPassword(auth, email, "randomSecurePassword");
      return cred.user.uid;
    } catch (err) {
      console.error(err);
      throw err; // Re-throw the error to propagate it to the caller
    }
  };

  const addToUserDb = async (uid) => {
    try {
      await setDoc(doc(userCollectionRef, uid), {
        email,
        role: "teacher",
      });
    } catch (err) {
      console.error(err);
      throw err;
    }
  };

  const addToTeacherDb = async (uid) => {
    try {
      await setDoc(doc(teacherCollectionRef, uid), {
        name,
        email,
      });
    } catch (err) {
      console.error(err);
      throw err;
    }
  };

  const handleSubmit = async () => {
    try {
      const uid = await createUser();
      await addToUserDb(uid);
      await addToTeacherDb(uid);
      console.log("Teacher added successfully");
    } catch (err) {
      console.error("Failed to add teacher:", err.message);
    } finally {
      setName("");
      setEmail("");
    }
  };

  console.log(name, email);

  return (
    <div>
      <h1>Add teacher</h1>
      <div>
        <label htmlFor="">Teacher's Name: </label>
        <input
          type="text"
          onChange={(e) => {
            setName(e.target.value);
          }}
          value={name}
        />

        <br />
        <label htmlFor="">Teacher's Email: </label>
        <input
          type="text"
          onChange={(e) => {
            setEmail(e.target.value);
          }}
          value={email}
        />

        <br />
        <button onClick={handleSubmit}>Submit</button>
      </div>
    </div>
  );
};
