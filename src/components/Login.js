import React from 'react'
import {Link} from 'react-router-dom'

const Login = () => {

    return (
        <div className={"container my-4"}>
            <div className={"my-4"}>
                <Link className={"btn btn-primary mx-2"} to="/vendorlogin">Login as a vendor</Link>
            </div>
            <div className={"my-4"}>
                <Link className={"btn btn-primary mx-2"} to="/userlogin">Login as a user</Link>
            </div>
        </div>
    )
}

export default Login