import { NavBar } from '../../Components/NavBar/navBar'
import { TitlePage } from '../../Components/title_page/title_page'
import { useEffect,useState } from 'react'
import axios from 'axios'
import '../styles/job_page.css'

export const JobsPage = () => {
    const url = "http://localhost:3001/";
    const [dataJobs, setDataJobs] = useState([]);
    const [dataDep, setDataDep] = useState([]);
    const [newJob, setNewJob] = useState({jobName :'' ,permissionLevel : '' ,jobDepartmentId: '' });

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


    useEffect(() => {
        async function fetchData() {
            await fetchInfoJobs();
            await fetchInfoDepartements();
        }
        fetchData();
    }, []);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
    
        if (name === "departement") {
            setNewJob({
                ...newJob,
                jobDepartmentId: value,
            });
        } else {
            setNewJob({
                ...newJob,
                [name]: value,
            });
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault(); 
        postNewJob(newJob);
        fetchInfoJobs();
    }


    return (
        <main>
            <NavBar/>
            <TitlePage title={'Jobs'}/>
            <div className='container_content_job'>
                <div className='container_add_job'>
                    <h2>Add a job</h2>
                    <form className="container_form_add_job" onSubmit={handleSubmit}>
                        <input name='jobName' type="text" placeholder='Name' value={newJob.jobName} onChange={handleInputChange}/>
                        <select required name="permissionLevel" value={newJob.jobId} onChange={handleInputChange}>
                            <option value="" selected disabled>-- Select a permission --</option>
                            <option value="--" >-- (can't see or create)</option>
                            <option value="r" >r (can only see)</option>
                            <option value="rw" >rw (can create and see)</option>
                          
                        </select>
                        <select required name="departement" value={newJob.jobDepartmentId} onChange={handleInputChange}>
                            <option value="" selected disabled>-- Select a departement --</option>
                            {dataDep.map((departement, index) => (
                                <option key={index} value={departement.jobDepartmentId}>{departement.name}</option>
                            ))}
                        </select>
                        <button className='btn_submit' type="submit">ADD</button>
                    </form>
                    <h2 className='title_existing_jobs'>Existing jobs</h2>
                </div>
                <div className='container_all_jobs'>
                    {dataJobs.map((job) => (
                        <div className='container_job_card' key={job.jobId}>
                            <p className='plus_icon_job'>+</p>
                            <i className='color_corner'></i>
                            <p>{job.jobName}</p>
                        </div>
                    ))}
                </div>
           </div>
        </main>
    )
}