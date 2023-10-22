import App from './Components/App/App';
import { EmployeePage } from './pages/templates/employees_page';
import { BrowserRouter, Routes, Route } from 'react-router-dom'


function Ways() {
  return (
    <>
      <BrowserRouter>
        <Routes>
            <Route path='/' element={<App />} />
            <Route path='/employees' element={<EmployeePage />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}
export default Ways;
