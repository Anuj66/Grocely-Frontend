import React, {useContext, useEffect, useState} from 'react'
import {useNavigate} from "react-router-dom";
import Context from '../context/Product/ProductContext'
import Alert from "./Alert";

const VendorLogin = () => {

    const navigator = useNavigate()
    const context = useContext(Context)
    const {signUp, setSignUp} = context
    const url = 'http://localhost:8080/api/auth'
    const [credentials, setCredentials] = useState({email: "", password: ""});
    const [invalid, setInvalid] = useState(false);

    const onChange = (e) => {
        setCredentials({...credentials, [e.target.name]: e.target.value})
    }

    useEffect(() => {
        if(signUp){
            setTimeout(()=>{
                setSignUp(false)
            }, 1500)
        }
    }, [invalid])

    const handleVendorLogin = async (e) => {
        e.preventDefault()

        const response = await fetch(`${url}/vendorLogin`, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({email: credentials.email, password: credentials.password})
        })

        const json = await response.json()

        if(json.success){
            localStorage.setItem('jwt_token', json.jwt_token)
            localStorage.setItem('role', 'Vendor')
            navigator('/vendorhome')
        }else{
            setInvalid(true)
        }
    }

    return (
        <div className={"container my-4"}>
            <form onSubmit={handleVendorLogin}>
                <h2 className={"my-2"}>Login as a Vendor</h2>
                <Alert invalid={invalid} error={"Please enter the Correct Credentials!"}/>
                {signUp && <div className="alert alert-success my-4" role="alert">
                    User Signed-Up Successfully!
                </div>}
                <div className="mb-3 my-3">
                    <label htmlFor="email" className="form-label">Email address</label>
                    <input type="email" name="email" className="form-control" id="email" aria-describedby="emailHelp" width={"60%"} required={true} onChange={onChange} value={credentials.email}/>
                </div>
                <div className="mb-3">
                    <label htmlFor="password" className="form-label">Password</label>
                    <input type="password" className="form-control" id="password" name={"password"} required={true} onChange={onChange} value={credentials.password}/>
                </div>
                <button type="submit" className="btn btn-primary">Submit</button>
            </form>
        </div>
    )
}

export default VendorLogin