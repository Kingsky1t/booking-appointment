import "./App.css";
import { Admin, Approval, Login, Logout, Student, Teacher } from "./components";
import { Route, Routes } from "react-router-dom";

function App() {
    return (
        <>
            <Logout />
            <Routes>
                <Route path='/' index element={<Login />} />
                <Route path='/approval' element={<Approval />} />
                <Route path='/admin' element={<Admin />} />
                <Route path='/teacher' element={<Teacher />} />
                <Route path='/student' element={<Student />} />
            </Routes>
        </>
    );
}

export default App;
