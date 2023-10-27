import { useState,useEffect } from 'react'
import { Employee } from '../../Components/Employee_component/employee'
import { NavBar } from '../../Components/NavBar/navBar'
import { TitlePage } from '../../Components/title_page/title_page'
import '../styles/employees_page.css'

export const EmployeePage = () => {
    const url = "http://localhost:3001/employees";
    const [dataEmployees,setDataEmployees] = useState([])

    const fetchInfo = () => {
        return fetch(url).then((res) => res.json()).then((d) => setDataEmployees(d))
      }

    useEffect(() => {
        fetchInfo()
    }, []);
    
    return(
        <div>
            <NavBar/>
            <TitlePage title={"Employees"}></TitlePage>
            <div className='container_all_employees'>
                {
                    dataEmployees.map((currentEmployee ,index) => (
                        <Employee key={index} employeesData = {currentEmployee}></Employee>
                    ))
                }
            </div>
         
           
        </div>
    )
}