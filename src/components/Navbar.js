import React from 'react'
import {Link, useLocation} from 'react-router-dom'

const Navbar = () => {

    const location = useLocation()


    const handleLogout = () => {
        localStorage.removeItem('jwt_token')
        localStorage.removeItem('role')
    };

    return (
        <div>
            <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
                <div className="container">
                    <Link className="navbar-brand" to="/">Grocely</Link>
                    <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent"
                            aria-expanded="false" aria-label="Toggle navigation">
                        <span className="navbar-toggler-icon"></span>
                    </button>
                    <div className="collapse navbar-collapse" id="navbarSupportedContent">
                        <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                            <li className="nav-item">
                                <Link className="nav-link active" aria-current="page" to="/">Home</Link>
                            </li>
                            <li className="nav-item">
                                <Link className="nav-link" to="/aboutus">About Us</Link>
                            </li>
                        </ul>
                        <form className="d-flex">
                            {!localStorage.getItem('jwt_token')?
                                <li className="nav-item d-flex" >
                                    <Link className={`btn btn-primary mx-2 ${location.pathname === '/login' ? "active" : ""}`} to="/login">Login</Link>
                                    <Link className={`btn btn-primary mx-2 ${location.pathname === '/signup' ? "active" : ""}`} to="/signup">Signup</Link>
                                </li> :
                                <div>
                                    <Link className={`btn btn-primary mx-2 ${location.pathname === '/login' ? "active" : ""}`} to="/login" onClick={handleLogout}>Logout</Link>
                                </div>

                            }
                        </form>
                    </div>
                </div>
            </nav>
        </div>
    )
}

export default Navbar