import { Popup } from '../Popup/popup';
import './employee.css'
import { useState,useEffect } from 'react';
import axios from 'axios';

export const Employee = (props ) => {
    const url = "http://localhost:3001/api"

    const { employeesData } = props;
    var entries = Object.entries(employeesData);
    var jobId = entries.slice(entries.length-1)
    var idEmployee = entries.slice(0,1)
    entries = entries.slice(1,entries.length-1);
    const [visibilityAdd ,setVisibilityAdd] = useState(false);
    const [permissionConnected,setPermissionsConnected] = useState('');


    
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

    const deleteEmployee = async () => {
        const idToDelete = {employeeId : idEmployee[0][1]}
        const data = await axios.post(url+'/employees/delete', idToDelete)
        return data.data
    }


    useEffect(()=> {
        let cookiePerm = getCookie("permissionConnected");
        if (cookiePerm != null) {
            setPermissionsConnected(cookiePerm)
        } else {
            setPermissionsConnected(cookiePerm)
        }
    },[])
    return (
        <div className="container_global_employee">
            <img className='img_employee' src="./src/assets/images/icon_employee.png" alt="icon_employees" />
            {
                entries.map(([key,value],index) => (
           
                    <div key={index} className=" container_one_value">
                        <div className='wrapper'>
                            <h5 className='title_cat_employee'>{key ?? ""}</h5>
                            <p className='content_employee'>{value ?? ""}</p>
                        </div>
                    </div>
                ))
            }
            {permissionConnected == "rw" && 
                <span onClick={(e) => {setVisibilityAdd(!visibilityAdd)}} className="material-symbols-outlined edit_icon">settings</span>
            }
            {permissionConnected == "rw" && 
                <span onClick={(e) => deleteEmployee().then(()=>{window.location.reload()})} className="material-symbols-outlined delete_icon">delete</span>
            }
            { visibilityAdd &&  <Popup idEmployee={idEmployee} jobId={jobId} datas={entries} isAdd={false} setVisibilityAdd={setVisibilityAdd}/>}
            
        </div>
    )
}