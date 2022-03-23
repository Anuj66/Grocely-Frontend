import React, {useContext, useEffect, useRef, useState} from 'react'
import Context from '../context/Product/ProductContext'
import {Link, useNavigate} from "react-router-dom";

const VendorHome = () => {

    const context = useContext(Context)
    const navigator = useNavigate()
    const {getAllVendorProducts, getVendorDetails, urlProduct, setCurrentProduct, getAllProductType} = context
    const [products, setProducts] = useState([])

    useEffect(async () => {
        if(localStorage.getItem('jwt_token') && localStorage.getItem('role') === 'Vendor'){
            setProducts([])
            let vd = await getVendorDetails()
            let tempProducts = await getAllVendorProducts(vd._id)
            let tempProductTypes = await getAllProductType()
            tempProducts.forEach((product) => {
                let productType = tempProductTypes.filter((productType) => {return productType._id === product.type})
                product.type = productType[0].name
            })
            setProducts(tempProducts)
        }else{
            alert('You are not authenticated')
            navigator('/login')
        }
    }, [])

    const handleUpdateOnClick = (product) => {
        setCurrentProduct(product)
        navigator('/updateproduct')
    }

    const handleDeleteOnClick = async (id) => {
        const response = await fetch(`${urlProduct}/deleteProduct/${id}`, {
            method: "DELETE",
            headers: {
                'Content-Type': 'application/json',
                'jwt_token': localStorage.getItem('jwt_token')
            }
        })

        const data = await response.json()
        if(data.success){
            let tempProducts = products.filter((product) => { return product._id !== id })
            setProducts(tempProducts)
            alert("Deleted Successfully")
        }else{
            alert(data.error)
        }
    }

    return (
        <div className={"container"}>

            <h3 className={"my-3"}>List of Products</h3>
            <table className="table">
                <thead>
                <tr>
                    <th scope="col">#</th>
                    <th scope="col">Name</th>
                    <th scope={"col"}>Type</th>
                    <th scope="col">Stock</th>
                    <th scope="col">Price</th>
                    <th scope="col">Edit</th>
                    <th scope="col">Delete</th>
                </tr>
                </thead>
                <tbody>
                {products.map((product, index) => {
                    return <tr>
                        <th key={index}>{index+1}</th>
                        <td>{product.name}</td>
                        <td>{product.type}</td>
                        <td>{product.stock}</td>
                        <td><i className="fa-solid fa-indian-rupee-sign"></i> {product.price}</td>
                        <td><i className="fa-solid fa-pen editIcon" onClick={() => {handleUpdateOnClick(product)}}></i></td>
                        <td><i className="fa-solid fa-trash deleteIcon" onClick={() => {handleDeleteOnClick(product._id)}}></i></td>
                    </tr>
                })}

                </tbody>
            </table>
            <Link className={"btn btn-primary my-3"} to={"/addproduct"}>Add a Product</Link>
        </div>
    )
}

export default VendorHome