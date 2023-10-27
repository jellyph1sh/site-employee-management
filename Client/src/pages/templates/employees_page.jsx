import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Employee } from '../../Components/Employee_component/employee';
import { NavBar } from '../../Components/NavBar/navBar';
import { TitlePage } from '../../Components/title_page/title_page';
import '../styles/employees_page.css';

export const EmployeePage = () => {
    const url = "http://localhost:3001/";
    const [dataEmployees, setDataEmployees] = useState([]);
    const [dataJobs, setDataJobs] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [sortedEmployees, setSortedEmployees] = useState([]);
    const [sortKey, setSortKey] = useState("");
    const [visibilityAdd ,setVisibilityAdd] = useState(false)
    const [newEmployee, setNewEmployee] = useState({lastname: '',firstname: '',email: '',salary: 0,birthdate: '',hiredate: '',jobId: ''});

    const fetchInfoEmployees = async () => {
        const response = await fetch(url + "employees");
        const data = await response.json();
        setDataEmployees(data);
    };

    const fetchInfoJobs = async () => {
        const response = await fetch(url + "jobs");
        const data = await response.json();
        setDataJobs(data);
    };

    
    const postNewEmployee = async (dataEmployee) => {
        console.log('data sent to post',dataEmployee);
        const data = await axios.post(url+'employee', dataEmployee)
        return data.data
    }


    useEffect(() => {
        async function fetchData() {
            await fetchInfoEmployees();
            await fetchInfoJobs();
        }
        fetchData();
    }, []);

    useEffect(() => {
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

    const handleSubmit = (e) => {
        e.preventDefault(); 
        postNewEmployee(newEmployee);
      
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
    
        if (name === "job") {
            setNewEmployee({
                ...newEmployee,
                jobId: value,
            });
        } else {
            setNewEmployee({
                ...newEmployee,
                [name]: value,
            });
        }
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
                <button className='container_add_employee' onClick={(e) => {setVisibilityAdd(!visibilityAdd)}}>Add an employee</button>
            </div>
            
            { visibilityAdd &&
                <div className='containerPopAdd'>
                    <div className="container_add">
                        <h2>Add an employee</h2>
                        <span onClick={(e) => {setVisibilityAdd(!visibilityAdd)}} className="close-button">X</span>
                        <form className='containerAddForm' onSubmit={handleSubmit}>
                            <div className='container_part_form'>
                                <input required placeholder='Last name :' type="text" name="lastname" value={newEmployee.lastname} onChange={handleInputChange} />
                                <input required placeholder='First name :' type="text" name="firstname" value={newEmployee.firstname} onChange={handleInputChange} />
                                <input required placeholder='Email :' type='email' name="email" value={newEmployee.email} onChange={handleInputChange} />
                                <input required placeholder='Salary:' type='number' name="salary" value={newEmployee.salary} onChange={handleInputChange} />
                            </div>
                            <div className='container_part_form'>
                                <div className='container_form_dates'>
                                    <label htmlFor="birthdate">Birth date :</label>
                                    <input required placeholder='Birth date :' type='date' name="birthdate" value={newEmployee.birthdate} onChange={handleInputChange} />
                                </div>
                                <div className='container_form_dates'>
                                    <label htmlFor="hiredate">Hire date :</label>
                                    <input required placeholder='Hire date :' type='date' name="hiredate" value={newEmployee.hiredate} onChange={handleInputChange} />
                                </div>
                                <select required name="job" value={newEmployee.jobId} onChange={handleInputChange}>
                                    <option value="" disabled>-- Select a job --</option>
                                    {dataJobs.map((jobItem, index) => (
                                        <option key={index} value={jobItem.jobId}>{jobItem.jobName}</option>
                                    ))}
                                   
                                </select>
                                
                            </div>
                            <button className='btn_submit' type="submit">ADD</button>
                        </form>
                    </div>
                </div>
            }
            <div className='container_all_employees'>
                {sortedEmployees.length === 0 ? (
                    <p className='not_found'>No employee found.</p>
                ) : (
                    sortedEmployees.map((currentEmployee, index) => (
                        <Employee key={index} employeesData={currentEmployee} />
                    ))
                )}
            </div>
        </div>
    );
};
