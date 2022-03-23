import React from 'react'

const Alert = (props) => {

    const {invalid, error} = props

    return (
        <>
            {invalid && <div className="alert alert-danger my-4" role="alert">
                {error}
            </div>}
        </>
    )
}

export default Alert