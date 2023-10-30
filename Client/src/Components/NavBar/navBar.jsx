import { useEffect, useState } from 'react'
import './navBar.css'

export const NavBar = () => {
    const [isConnected,setIsConnected] = useState(false);

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

    function deleteCookie(name) {
        document.cookie = name + "=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    }



    useEffect(() => {
        let cookiePerm = getCookie("permissionConnected");
        if (cookiePerm != null) {
            setIsConnected(true)
        } else {
            setIsConnected(false)
        }
        console.log(isConnected);
      }, []);

    return (
        <nav>
            <div className="container_title_nav">
                <span className='dots'></span>
                <h1 className='main_title'>TokaTeam</h1>
                <h1 className='subtitle'>Pro</h1>
                <span className='dots'></span>
            </div>
            <div className="container_title_nav_mobile">
                <span className='dots'></span>
                <h1 className='main_title'>Toka</h1>
                <h1 className='subtitle'>Pro</h1>
                <span className='dots'></span>
            </div>
            <img className='background_nav_header' src="./src/assets/images/background_nav.png" alt="background_nav_image" />
            <div className='container_categories'>
                <a href="/">
                    <div className='container_one_cat_nav'>
                        <span></span>
                        <p>Home</p>
                    </div>
                </a>
                <a href="/employees">
                    <div className='container_one_cat_nav'>
                        <span></span>
                        <p>Employees</p>
                    </div>
                </a>   
                <a href="/jobs">
                    <div className='container_one_cat_nav'>
                        <span></span>
                        <p>Jobs</p>
                    </div>
                </a>     
            </div>
            {(isConnected == false) && 
                <div className='signIn_container'>
                    <a className='btn_singIn_register' href="/signin">SignIn</a>
                </div>
            }
            {isConnected && 
                <div onClick={(e)=> deleteCookie("permissionConnected")} className='signIn_container'>
                    <a className='btn_singIn_register' href="/">Log out</a>
                </div>
            }
        </nav>
    )
}