import Home from './pages/templates/Home';
import { EmployeePage } from './pages/templates/employees_page';
import { BrowserRouter, Routes, Route } from 'react-router-dom'


function Ways() {
  return (
    <>
      <BrowserRouter>
        <Routes>
            <Route path='/' element={<Home />} />
            <Route path='/employees' element={<EmployeePage />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}
export default Ways;
