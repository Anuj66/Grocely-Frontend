import React from 'react'
import {Link} from "react-router-dom";

const Signup = () => {
    return (
        <div className={"container my-4"}>
            <div className={"my-4"}>
                <Link className={"btn btn-primary mx-2"} to="/vendorsignup">Sign Up as a vendor</Link>
            </div>
            <div>
                <Link className={"btn btn-primary mx-2"} to="/usersignup">Sign Up as a user</Link>
            </div>
        </div>
    )
}

export default Signup