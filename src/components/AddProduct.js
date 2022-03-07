import React, {useContext, useEffect, useState} from 'react'
import Context from '../context/Product/ProductContext'
import {Link, useNavigate} from "react-router-dom";

const AddProduct = () => {

    const context = useContext(Context)
    const [product, setProduct] = useState({name: "", type: "", stock: "", price: ""});
    const [productTypes, setProductTypes] = useState([])
    const {urlProduct, getAllProductType} = context
    const navigator = useNavigate()

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
            alert('Either Product details not correct or Product with this name already exists')
        }
    }


    return (
        <div className={"container"}>
            <h3>Please enter product details</h3>
            <form onSubmit={handleSubmit}>
                <div className="mb-3">
                    <label htmlFor="name" className="form-label">Name</label>
                    <input type="text" className="form-control" id="name" name={"name"} required={true} value={product.name} onChange={onChange}/>
                </div>
                <div className="mb-3">
                    <label htmlFor="type" className="form-label">Type</label>
                    <select className="form-select" aria-label="Default select example" id={"type"} name={"type"} onChange={onChange} required={true}>
                        <option selected>Select Product Type</option>
                        {productTypes.map((productType) => {
                            return <option key={productType._id} value={productType._id}>{productType.name}</option>
                        })}
                    </select>
                </div>
                <div className="mb-3">
                    <label htmlFor="stock" className="form-label">Stock</label>
                    <input type="number" className="form-control" id="stock" name={"stock"} required={true} value={product.stock} onChange={onChange}/>
                </div>
                <div className="mb-3">
                    <label htmlFor="price" className="form-label">Price</label>
                    <input type="number" className="form-control" id="price" name={"price"} required={true} value={product.price} onChange={onChange}/>
                </div>

                <button type="submit" className="btn btn-primary mx-2">Add</button>
                <Link className="btn btn-primary mx-2" to={'/vendorhome'}>Cancel</Link>
            </form>
        </div>
    )
}

export default AddProduct