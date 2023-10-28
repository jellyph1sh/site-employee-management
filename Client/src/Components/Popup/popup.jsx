import './popup.css'
import axios from 'axios';
import React, { useState, useEffect } from 'react';

export const Popup =({ setVisibilityAdd, isAdd,datas,jobId }) => {
    const url = "http://localhost:3001/";

    const [dataJobs, setDataJobs] = useState([]);
    const [newEmployee, setNewEmployee] = useState({lastname: isAdd ? '' : datas[0][1],firstname: isAdd ? '' : datas[1][1],email: isAdd ? '' : datas[2][1],salary: isAdd ? 'Salary :' : datas[6][1],birthdate: isAdd ? '' : datas[3][1],hiredate: isAdd ? '' : datas[4][1],jobId: isAdd ? '' : jobId[0][1]});

    const fetchInfoJobs = async () => {
        const response = await fetch(url + "jobs");
        const data = await response.json();
        setDataJobs(data);
    };
    useEffect(() => {
        async function fetchData() {
            await fetchInfoJobs();
        }
        fetchData();
    }, []);

    const postNewEmployee = async (dataEmployee) => {
        console.log('data sent to post',dataEmployee);
        const data = await axios.post(url+'employee', dataEmployee)
        return data.data
    }

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
        
        <div className='containerPopAdd'>
            <div className="container_add">
                {isAdd && <h2>Add an employee</h2>}
                {(isAdd == false) && <h2>Edit an employee</h2>}
                <span onClick={() => setVisibilityAdd(false)} className="close-button">X</span>
                <form className='containerAddForm' onSubmit={handleSubmit}>
                    <div className='container_part_form'>
                        <input required placeholder={isAdd ? 'Last name :' : datas[0][1]} type="text" name="lastname" value={newEmployee.lastname} onChange={handleInputChange} />
                        <input required placeholder={isAdd ? 'First name :' : datas[1][1]} type="text" name="firstname" value={newEmployee.firstname} onChange={handleInputChange} />
                        <input required placeholder={isAdd ? 'Email :' : datas[2][1]} type='email' name="email" value={newEmployee.email} onChange={handleInputChange} />
                        <input required placeholder={isAdd ? 'Salary:' : String(datas[6][1])} type='number' name="salary" value={newEmployee.salary} onChange={handleInputChange} />
                    </div>
                    <div className='container_part_form'>
                        <div className='container_form_dates'>
                            <label htmlFor="birthdate">Birth date :</label>
                            <input required placeholder={isAdd ? 'Birth date :' : datas[3][1]} type='date' name="birthdate" value={newEmployee.birthdate} onChange={handleInputChange} />
                        </div>
                        <div className='container_form_dates'>
                            <label htmlFor="hiredate">Hire date :</label>
                            <input required placeholder={isAdd ? 'Hire date :' : datas[4][1]} type='date' name="hiredate" value={newEmployee.hiredate} onChange={handleInputChange} />
                        </div>
                        <select required name="job" value={isAdd ? newEmployee.jobId : datas[5][1]} onChange={handleInputChange}>
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
    )
}