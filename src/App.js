import "./App.css";
import { Home } from "./components/Home";
import { Login } from "./components/Login";
import { Logout } from "./components/Logout";
import { Admin } from "./components/Admin";
import { Student } from "./components/Student";
import { Teacher } from "./components/Teacher";
import { Route, Routes } from "react-router-dom";

function App() {
    return (
        <>
            <Logout />
            <Routes>
                <Route path='/' index element={<Login />} />
                <Route path='/home' element={<Home />} />
                <Route path='/admin' element={<Admin />} />
                <Route path='/teacher' element={<Teacher />} />
                <Route path='/student' element={<Student />} />
            </Routes>
        </>
    );
}

export default App;
