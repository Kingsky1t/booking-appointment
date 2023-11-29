import { Admin, Approval, Login, Logout, Student, Teacher, Error } from "./components";
import { Route, Routes } from "react-router-dom";

function App() {
    return (
        <>
            {/* <Logout /> */}
            <Routes>
                <Route path='/' index element={<Login />} />
                <Route path='/approval' element={<Approval />} />
                <Route path='/admin' element={<Admin />} />
                <Route path='/teacher' element={<Teacher />} />
                <Route path='/student' element={<Student />} />
                <Route path='*' element={<Error />} />
            </Routes>
        </>
    );
}

export default App;
