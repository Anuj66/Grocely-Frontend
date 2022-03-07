import React, {useState} from 'react'
import {useNavigate} from "react-router-dom";

const VendorSignup = () => {

    const navigator = useNavigate()
    const url = 'http://localhost:8080/api/auth'
    const [credentials, setCredentials] = useState({username: "", email: "", password: ""});

    const onChange = (e) => {
        setCredentials({...credentials, [e.target.name]: e.target.value})
    }

    const handleSubmit = async (e) => {
        e.preventDefault()

        const response = await fetch(`${url}/createVendor`,{
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({name: credentials.name, email: credentials.email, password: credentials.password})
        })

        const json = await response.json()
        if(json.success){
            console.log('Successfully Created Account')
            navigator('/vendorlogin')
        }else{
            alert(json.error)
        }
    }

    return (
        <div>
            <form onSubmit={handleSubmit}>
                <div className="mb-3">
                    <label htmlFor="email" className="form-label">Email address</label>
                    <input type="email" className="form-control" id="email" name={"email"} aria-describedby="emailHelp" required={true} onChange={onChange} value={credentials.email}/>
                    <div id="emailHelp" className="form-text">We'll never share your email with anyone else.</div>
                </div>

                <div className="mb-3">
                    <label htmlFor="name" className="form-label">Username</label>
                    <input type="text" className="form-control" id="name" name={"name"} required={true} onChange={onChange} value={credentials.name}/>
                </div>

                <div className="mb-3">
                    <label htmlFor="password" className="form-label">Password</label>
                    <input type="password" className="form-control" id="password" name={"password"} required={true} onChange={onChange} value={credentials.password}/>
                </div>

                <div className="mb-3">
                    <label htmlFor="confirmPassword" className="form-label">Confirm Password</label>
                    <input type="password" className="form-control" id="confirmPassword" name={"confirmPassword"} required={true} onChange={onChange} />
                </div>

                <button type="submit" className="btn btn-primary">Sign Up</button>
            </form>
        </div>
    )
}

export default VendorSignup