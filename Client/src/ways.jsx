import Home from './pages/templates/home';
import { EmployeePage } from './pages/templates/employees_page';
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { SignIn } from './pages/templates/signIn';


function Ways() {
  return (
    <>
      <BrowserRouter>
        <Routes>
            <Route path='/' element={<Home />} />
            <Route path='/employees' element={<EmployeePage />} />
            <Route path='/signin' element={<SignIn/>}/>
        </Routes>
      </BrowserRouter>
    </>
  );
}
export default Ways;
