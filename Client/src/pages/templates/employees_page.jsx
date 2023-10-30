import React, { useState, useEffect } from 'react';
import { Employee } from '../../Components/Employee_component/employee';
import { NavBar } from '../../Components/NavBar/navBar';
import { TitlePage } from '../../Components/title_page/title_page';
import '../styles/employees_page.css';
import { Popup } from '../../Components/Popup/popup';

export const EmployeePage = () => {
    const url = "http://localhost:3001/";
    const [dataEmployees, setDataEmployees] = useState([]);
    const [visibilityAdd ,setVisibilityAdd] = useState(false)
    const [searchTerm, setSearchTerm] = useState('');
    const [sortedEmployees, setSortedEmployees] = useState([]);
    const [sortKey, setSortKey] = useState("");
    const [permissionConnected,setPermissionsConnected] = useState('');
   
    const fetchInfoEmployees = async () => {
        const response = await fetch(url + "employees");
        const data = await response.json();
        setDataEmployees(data);
    };

    function getCookie(name) {
        const cookieName = name + "=";
        const cookies = document.cookie.split(';');
        
        for (let i = 0; i < cookies.length; i++) {
            let cookie = cookies[i].trim();
            if (cookie.indexOf(cookieName) === 0) {
                return cookie.substring(cookieName.length, cookie.length);
            }
        }
      
        return null;
    }



    useEffect(() => {
        async function fetchData() {
            await fetchInfoEmployees();
        }
        fetchData();
    }, []);

    useEffect(() => {
        let cookiePerm = getCookie("permissionConnected");
        if (cookiePerm != null) {
            setPermissionsConnected(cookiePerm)
        } else {
            setPermissionsConnected(cookiePerm)
        }

        const filtered = dataEmployees.filter((employee) => {
            const fullName = `${employee.name} ${employee.firstName} `;
            return fullName.toLowerCase().includes(searchTerm.toLowerCase());
        });
    
        if (sortKey) {
            filtered.sort((a, b) => {
                if (typeof a[sortKey] === 'string' && typeof b[sortKey] === 'string') {
                    return a[sortKey].localeCompare(b[sortKey]);
                } else {
                    return a[sortKey] - b[sortKey];
                }
            });
        }
    
        setSortedEmployees(filtered);
    }, [searchTerm, sortKey, dataEmployees]);

    const handleSort = (key) => {
        setSortKey(key);
    };

    

    return (
        <div>
            <NavBar />
            <TitlePage title={"Employees"} />
            <div className='container_searchandsort'>
                <input className='search_employee' type="search" placeholder="Search an employee" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}/>
                <div className='sort_container'>
                    <label>Sort by :</label>
                    <select value={sortKey} onChange={(e) => handleSort(e.target.value)}>
                        <option value="" disabled>-- Choose Sort --</option>
                        <option value="name">Last Name (A-Z)</option>
                        <option value="jobName">Job Name (A-Z)</option>
                        <option value="salary">Salary (ASC)</option>
                        <option value="hireDate">Hire Date (oldest)</option>
                    </select>
                </div>
                {permissionConnected == "rw" && 
                    <button id='add' className='button_add_employee' onClick={(e) => {setVisibilityAdd(!visibilityAdd)}}>Add an employee</button>
                }
            </div>
            { visibilityAdd &&  <Popup isAdd={true} setVisibilityAdd={setVisibilityAdd}/>}
            { (permissionConnected == "rw" || permissionConnected == "r") ? 
                (
                    <div className='container_all_employees'>
                        {sortedEmployees.length === 0 ? (
                            <p className='not_found'>No employee found.</p>
                        ) : (
                            sortedEmployees.map((currentEmployee, index) => (
                                <Employee key={index} employeesData={currentEmployee} />
                            ))
                        )}
                    </div>
                ) : (
                    <div className='container_all_employees'>
                        <p className='not_found'>You are not allowed to see any informations.</p>
                    </div>
                )
            }
        </div>
    );
};
