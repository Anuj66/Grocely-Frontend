import React, {useState} from 'react'
import {useNavigate} from "react-router-dom";

const UserLogin = () => {

    const navigator = useNavigate()
    const url = 'http://localhost:8080/api/auth'

    const [credentials, setCredentials] = useState({email: "", password: ""});

    const onChange = (e) => {
        setCredentials({...credentials, [e.target.name]: e.target.value})
    }

    const handleUserLogin = async (e) => {
        e.preventDefault()

        const response = await fetch(`${url}/userLogin`, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({email: credentials.email, password: credentials.password})
        })

        const json = await response.json()

        if(json.success){
            localStorage.setItem('jwt_token', json.jwt_token)
            localStorage.setItem('role', 'User')
            navigator('/userhome')
        }else{
            alert(json.error)
        }
    }

    return (
        <div>
            <form onSubmit={handleUserLogin}>
                <h2 className={"my-2"}>Login as a User</h2>
                <div className="mb-3 my-3">
                    <label htmlFor="email" className="form-label">Email address</label>
                    <input type="email" className="form-control" id="email" aria-describedby="emailHelp" name={"email"} onChange={onChange} value={credentials.email} required={true}/>
                    <div id="emailHelp" className="form-text">We'll never share your email with anyone else.</div>
                </div>
                <div className="mb-3">
                    <label htmlFor="password" className="form-label">Password</label>
                    <input type="password" className="form-control" id="password" name={"password"} onChange={onChange} value={credentials.password} required={true}/>
                </div>
                <button type="submit" className="btn btn-primary">Submit</button>
            </form>
        </div>
    )
}

export default UserLogin