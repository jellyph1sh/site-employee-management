import { NavBar } from '../../Components/NavBar/navBar'
import { TitlePage } from '../../Components/title_page/title_page'
import { useEffect,useState } from 'react'
import axios from 'axios'
import '../styles/job_page.css'

export const JobsPage = () => {
    const url = "http://localhost:3001/";
    const [dataJobs, setDataJobs] = useState([]);
    const [dataDep, setDataDep] = useState([]);
    const [permissionConnected,setPermissionsConnected] = useState('');
    const [newJob, setNewJob] = useState({jobName :'' ,permissionLevel : '' ,jobDepartmentId: 0 });
    const [updateJobDatas, setUpdateJobDatas] = useState({});

    const fetchInfoJobs = async () => {
        const response = await fetch(url + "jobs");
        const data = await response.json();
        setDataJobs(data);
    };

    const fetchInfoDepartements = async () => {
        const response = await fetch(url + "jobsDepartments");
        const data = await response.json();
        setDataDep(data);
    };

    const postNewJob = async (dataJob) => {
        console.log('data sent to post job',dataJob);
        const data = await axios.post(url+'job', dataJob)
        return data.data
    }

    const updateJob = async (dataJob) => {
        console.log('job update with datas : ' , dataJob);
        const response  = await axios.put(url + 'updateJob' ,dataJob);
        return response.data
    }

        
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
            await fetchInfoJobs();
            await fetchInfoDepartements();
        }
        fetchData();
        
    }, []);

    useEffect(()=> {
        let cookiePerm = getCookie("permissionConnected");
        if (cookiePerm != null) {
            setPermissionsConnected(cookiePerm)
        } else {
            setPermissionsConnected(cookiePerm)
        }
    },[])

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        if (name === 'updateName' || name === 'updateJobDepartmentId' || name === 'updatePerm' ) {
            setUpdateJobDatas({
                ...updateJobDatas,
                [name]: value,
            });
        } else {
            if (name === "departement") {
                setNewJob({
                    ...newJob,
                    jobDepartmentId: parseInt(value),
                });
            } else {
                setNewJob({
                    ...newJob,
                    [name]: value,
                });
            }
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault(); 
        if (e.target.name == 'edit') {
            console.log('a');
            const idJob = e.target.updateJobId.value
            const name = e.target.updateName.value;
            const permission = e.target.updatePerm.value;
            const departement = e.target.updateJobDepartmentId.value;
            console.log(idJob,name,permission,departement);

            updateJob({updateJobId: idJob , updateName : name , updatePerm : permission , updateJobDepartmentId: departement});
        } else {
            postNewJob(newJob);
            
        }
        fetchInfoJobs();
     
    }

    const [formVisibility, setFormVisibility] = useState({});

    const toggleFormVisibility = (jobId) => {
        setFormVisibility((prevState) => ({
          ...prevState,
          [jobId]: !prevState[jobId],
        }));
    };

    return (
        <main>
            <NavBar/>
            <TitlePage title={'Jobs'}/>
            <div className='container_content_job'>
                {permissionConnected == "rw" && 
                    <div className='container_add_job'>
                        <h2>Add a job</h2>
                        <form className="container_form_add_job" onSubmit={handleSubmit}>
                            <input required className='input_bottom_border' name='jobName' type="text" placeholder='Name' value={newJob.jobName} onChange={handleInputChange}/>
                            <select required name="permissionLevel" value={newJob.permissionLevel} onChange={handleInputChange}>
                                <option value="" defaultValue={'-- Select a permission --'} disabled>-- Select a permission --</option>
                                <option value="--" >-- (can't see or create)</option>
                                <option value="r" >r (can only see)</option>
                                <option value="rw" >rw (can create and see)</option>
                            </select>
                            <select required name="departement" value={parseInt(newJob.jobDepartmentId)} onChange={handleInputChange}>
                                <option value="" defaultValue={'-- Select a departement --'} disabled>-- Select a departement --</option>
                                {dataDep.map((departement, index) => (
                                    <option key={index} value={departement.jobDepartmentId}>{departement.name}</option>
                                ))}
                            </select>
                            <button className='btn_submit' type="submit">ADD</button>
                        </form>
                        <h2 className='title_existing_jobs'>Existing jobs</h2>
                    </div>
                }
                {(permissionConnected == "rw" || permissionConnected == "r-") ?
                    <div className='container_all_jobs'>
                        {dataJobs.map((job) => (
                            <div className='container_job_card' key={job.jobId}>
                                {permissionConnected == "rw" && 
                                    <p onClick={() => toggleFormVisibility(job.jobId)} className='plus_icon_job'>
                                        {formVisibility[job.jobId] ? '-' : '+'}
                                    </p>
                                }
                                <i className='color_corner'></i>
                                <p>{job.jobName}</p>
                                {formVisibility[job.jobId] && (
                                    <form id={job.jobId} name='edit'  className="popup_edit_job " onSubmit={handleSubmit}>
                                        <input className='input_bottom_border' name='updateName' type="text" placeholder={job.jobName} defaultValue={job.jobName} value={updateJob.jobName} onChange={handleInputChange}/>
                                        <select required name="updatePerm" value={job.permissionLevel} onChange={handleInputChange}>
                                            <option value={job.permissionLevel}  disabled>{job.permissionLevel}</option>
                                            <option value="--" >-- (can't see or create)</option>
                                            <option value="r-" >r (can only see)</option>
                                            <option value="rw" >rw (can create and see)</option>
                                        </select>
                                        <select required name="updateJobDepartmentId" value={job.jobDepartmentId} onChange={handleInputChange}>
                                            <option value={job.departmentName}  disabled>{job.departmentName}</option>
                                            {dataDep.map((departement, index) => (
                                                <option key={index} value={departement.jobDepartmentId}>{departement.name}</option>
                                            ))}
                                        </select>
                                        <input type="text" style={{display:'none'}} value={job.jobId} name='updateJobId' onChange={handleInputChange} />
                                        <button className='btn_submit' type="submit">ADD</button>
                                    </form>
                                )}
                            </div>
                        ))}
                    </div>
                : (
                    <p className='text_permission'>You are not allowed to see any informations.</p>
                )}
           </div>
        </main>
    )
}