import React, {useContext, useState} from 'react'
import {useNavigate} from "react-router-dom";
import Context from '../context/Product/ProductContext'
import Alert from './Alert'

const VendorSignup = () => {

    const navigator = useNavigate()
    const context = useContext(Context)
    const {signUp, setSignUp} = context
    const url = 'http://localhost:8080/api/auth'
    const [credentials, setCredentials] = useState({name: "", email: "", password: ""});
    const [invalid, setInvalid] = useState(false)
    const [errorMessage, setErrorMessage] = useState('Please enter correct credentials')
    const [currentPassword, setCurrentPassword] = useState(credentials.password)

    const onChange = (e) => {
        setCredentials({...credentials, [e.target.name]: e.target.value})
    }

    const validateEmail = (email) => {
        return String(email)
            .toLowerCase()
            .match(
                /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
            );
    };

    const onCPChange = (e) => {
        setCurrentPassword(e.target.value)
    }

    const handleSubmit = async (e) => {
        e.preventDefault()

        if(credentials.email.length === 0 && validateEmail(credentials.email)){
            setInvalid(true)
            setErrorMessage('Please check the Email: Valid Email is required!')
        }
        if(credentials.name.length < 3){
            setInvalid(true)
            setErrorMessage('Please check the Username : Minimum of 3 characters are required!')
        }else if(credentials.password.length < 5){
            setInvalid(true)
            setErrorMessage('Please check the Password : Minimum of 5 characters are required!')
        }else if(credentials.password !== currentPassword){
            setInvalid(true)
            setErrorMessage('Confirm Password does not match with the Password!')
        }else{
            const response = await fetch(`${url}/createVendor`,{
                method: "POST",
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({name: credentials.name, email: credentials.email, password: credentials.password})
            })

            const json = await response.json()
            if(json.success){
                setSignUp(true)
                navigator('/vendorlogin')
            }else{
                setInvalid(true)
                setErrorMessage('User with this email address already exists!')
            }
        }

    }

    return (
        <div className={"container my-4"}>
            <h2 className={"my-4"}>Sign Up as a Vendor</h2>
            <Alert invalid={invalid} error={errorMessage}/>
            <form onSubmit={handleSubmit}>
                <div className="mb-3">
                    <label htmlFor="email" className="form-label">Email address</label>
                    <input type="email"
                           className="form-control"
                           id="email"
                           name={"email"}
                           aria-describedby="emailHelp"
                           required={true}
                           onChange={onChange}
                           value={credentials.email}/>
                </div>

                <div className="mb-3">
                    <label htmlFor="name" className="form-label">Username</label>
                    <input type="text"
                           className="form-control"
                           id="name"
                           name={"name"}
                           onChange={onChange}
                           value={credentials.name}/>
                </div>

                <div className="mb-3">
                    <label htmlFor="password" className="form-label">Password</label>
                    <input type="password"
                           className="form-control"
                           id="password"
                           name={"password"}
                           onChange={onChange}
                           value={credentials.password}/>
                </div>

                <div className="mb-3">
                    <label htmlFor="confirmPassword" className="form-label">Confirm Password</label>
                    <input type="password"
                           className="form-control"
                           id="confirmPassword"
                           name={"confirmPassword"}
                           onChange={onCPChange}
                           value={currentPassword}
                    />
                </div>

                <button type="submit" className="btn btn-primary">Sign Up</button>
            </form>
        </div>
    )
}

export default VendorSignup