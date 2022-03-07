import React from 'react'
import {Link} from "react-router-dom";

const Signup = () => {
    return (
        <div>
            <div className={"row"}>
                <div className={"col mx-4"}>
                    <Link className={"btn btn-primary mx-2"} to="/vendorsignup">Sign Up as a vendor</Link>
                </div>
                <div className={"col"}>
                    <Link className={"btn btn-primary mx-2"} to="/usersignup">Sign Up as a user</Link>
                </div>
            </div>
        </div>
    )
}

export default Signup