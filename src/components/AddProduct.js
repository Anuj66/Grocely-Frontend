import React, {useContext, useEffect, useState} from 'react'
import Context from '../context/Product/ProductContext'
import {Link, useNavigate} from "react-router-dom";
import Alert from "./Alert";

const AddProduct = () => {

    const context = useContext(Context)
    const [product, setProduct] = useState({name: "", type: "", stock: "", price: ""});
    const [productTypes, setProductTypes] = useState([])
    const {urlProduct, getAllProductType} = context
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
        setProduct({...product, [e.target.name]: e.target.value})
    }

    const handleSubmit = async (e) => {
        e.preventDefault()

        if(product.name.length < 3){
            setInvalid(true)
            setError('Please check name: Minimum 3 characters are required!')
        }else if(product.stock <= 0){
            setInvalid(true)
            setError('Please enter the valid stock value!')
        }else if(product.price <= 0){
            setInvalid(true)
            setError('Please enter the valid price value!')
        }else if(!product.type){
            setInvalid(true)
            setError('Please select the product type!')
        }else{
            const response = await fetch(`${urlProduct}/addProduct`, {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json',
                    'jwt_token': localStorage.getItem('jwt_token')
                },
                body: JSON.stringify({name: product.name, type: product.type, stock: product.stock, price: product.price})
            })
            const data = await response.json()
            if(data.success){
                alert('Product has been added')
                navigator('/vendorhome')
            }else{
                setInvalid(true)
                setError('Product already exists')
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
                    <input type="text" className="form-control" id="name" name={"name"} value={product.name} onChange={onChange}/>
                </div>
                <div className="mb-3">
                    <label htmlFor="type" className="form-label">Type</label>
                    <select className="form-select" aria-label="Default select example" id={"type"} required={true} name={"type"} onChange={onChange}>
                        <option selected>Select Product Type</option>
                        {productTypes.map((productType) => {
                            return <option key={productType._id} value={productType._id}>{productType.name}</option>
                        })}
                    </select>
                </div>
                <div className="mb-3">
                    <label htmlFor="stock" className="form-label">Stock</label>
                    <input type="number" className="form-control" id="stock" name={"stock"} value={product.stock} required={true} onChange={onChange}/>
                </div>
                <div className="mb-3">
                    <label htmlFor="price" className="form-label">Price</label>
                    <input type="number" className="form-control" id="price" name={"price"} value={product.price} required={true} onChange={onChange}/>
                </div>

                <button type="submit" className="btn btn-primary mx-2">Add</button>
                <Link className="btn btn-primary mx-2" to={'/vendorhome'}>Cancel</Link>
            </form>
        </div>
    )
}

export default AddProduct