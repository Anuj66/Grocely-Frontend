import React, {useContext, useEffect, useState} from 'react'
import {Link, useNavigate} from "react-router-dom";
import Context from '../context/Product/ProductContext'
import Alert from "./Alert";

const UpdateProduct = () => {

    const context = useContext(Context)
    const {currentProduct, setCurrentProduct, getAllProductType, urlProduct} = context
    const [productTypes, setProductTypes] = useState([])
    const navigator = useNavigate()
    const [invalid, setInvalid] = useState(false)
    const [error, setError] = useState('Please enter the correct values!')

    useEffect(async () => {
        if(localStorage.getItem('jwt_token') && localStorage.getItem('role') === 'Vendor'){
            const data = await getAllProductType()
            setProductTypes(data)
        }else{
            alert('You are not authenticated')
            navigator('/login')
        }

    }, [])

    const onChange = (e) => {
        setCurrentProduct({...currentProduct, [e.target.name]: e.target.value})
    }

    const handleSubmit = async (e) => {
        e.preventDefault()

        if(currentProduct.name.length < 3){
            setInvalid(true)
            setError('Please check name: Minimum 3 characters are required!')
        }else if(currentProduct.stock <= 0){
            setInvalid(true)
            setError('Please enter the valid stock value!')
        }else if(currentProduct.price <= 0){
            setInvalid(true)
            setError('Please enter the valid price value!')
        }else if(!currentProduct.type){
            setInvalid(true)
            setError('Please select the product type!')
        }else{
            let tempProductType = productTypes.filter((productType) => {return productType.name === currentProduct.type})

            const response = await fetch(`${urlProduct}/updateProduct/${currentProduct._id}`,{
                method: "PUT",
                headers: {
                    'Content-Type': 'application/json',
                    'jwt_token': localStorage.getItem('jwt_token')
                },
                body: JSON.stringify({name: currentProduct.name, type: tempProductType._id, stock: currentProduct.stock, price: currentProduct.price})
            })
            const data = await response.json()
            if(data.success){
                navigator('/vendorhome')
            }else{
                setInvalid(true)
                setError('Invalid Details entered!')
            }
        }
    }

    return (
        <div className={"container"}>
            <h3 className={"my-3"}>Please enter product details</h3>

            <Alert invalid={invalid} error={error}/>

            <form onSubmit={handleSubmit}>
                <div className="mb-3">
                    <label htmlFor="name" className="form-label">Name</label>
                    <input type="text" className="form-control" id="name" name={"name"} required={true} value={currentProduct.name} onChange={onChange}/>
                </div>
                <div className="mb-3">
                    <label htmlFor="type" className="form-label">Type</label>
                    <select className="form-select" aria-label="Default select example" id={"type"} name={"type"} onChange={onChange} required={true}>
                        <option selected>{currentProduct.type}</option>
                        {productTypes.map((productType) => {
                            return <option key={productType._id} value={productType._id}>{productType.name}</option>
                        })}
                    </select>
                </div>
                <div className="mb-3">
                    <label htmlFor="stock" className="form-label">Stock</label>
                    <input type="number" className="form-control" id="stock" name={"stock"} required={true} value={currentProduct.stock} onChange={onChange}/>
                </div>
                <div className="mb-3">
                    <label htmlFor="price" className="form-label">Price</label>
                    <input type="number" className="form-control" id="price" name={"price"} required={true} value={currentProduct.price} onChange={onChange}/>
                </div>

                <button type="submit" className="btn btn-primary mx-2">Update</button>
                <Link className="btn btn-primary mx-2" to={'/vendorhome'}>Cancel</Link>
            </form>
        </div>
    )
}

export default UpdateProduct