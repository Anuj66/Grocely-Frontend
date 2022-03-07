import React from 'react'
import Login from './Login'
import UserHome from "./UserHome";
import VendorHome from "./VendorHome";

const Home = () => {

    const token = localStorage.getItem('jwt_token')

    return (
        <div>
            {!token ? <Login /> : localStorage.getItem('role') === 'User' ? <UserHome /> : <VendorHome />}
        </div>
    )
}

export default Home