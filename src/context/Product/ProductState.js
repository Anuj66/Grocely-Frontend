import React, {useEffect, useState} from 'react'
import ProductContext from "./ProductContext";

const ProductState = (props) => {

    const urlAuth = 'http://localhost:8080/api/auth'
    const urlProduct = 'http://localhost:8080/api/product'
    const urlProductType = 'http://localhost:8080/api/productType'
    const urlBuyer = 'http://localhost:8080/api/buyer'
    const [currentProduct, setCurrentProduct] = useState({id: '', name: '', type: '', stock: '', price: ''})


    //Get Vendor Detail
    const getVendorDetails = async () => {
        const response = await fetch(`${urlAuth}/getVendor`,{
            method: "GET",
            headers: {
                'Content-Type': 'application/json',
                'jwt_token': localStorage.getItem('jwt_token')
            }
        })

        const data = await response.json()

        if(data.success){
            return data.vendor
        }else{
            alert(data.error)
        }
    }

    //Get All Vendor Products
    const getAllVendorProducts = async (id) => {
        const response = await fetch(`${urlProduct}/getProductByVendor/${id}`, {
            method: "GET",
            headers: {
                'Content-Type': 'application/json',
                'jwt_token': localStorage.getItem('jwt_token')
            }
        })

        const data = await response.json()
        return data
    }

    //Get All Product Type
    const getAllProductType = async () => {
        const response = await fetch(`${urlProductType}/getAllProductType`,{
            method: "GET",
            headers: {
                'Content-Type': 'application/json'
            }
        })
        const data = await response.json()
        return data
    }

    //Get All Vendors
    const getAllVendors = async () => {
        const response = await fetch(`${urlAuth}/getAllVendors`, {
            method: "GET",
            headers: {
                'Content-Type': 'application/json',
                'jwt_token': localStorage.getItem('jwt_token')
            }
        })
        const data = await response.json()
        if(data.success){
            return data.vendors
        }else{
            console.log('Not hitting the auth api')
        }
    }

    //Get All Products
    const getAllProducts = async () => {
        const response = await fetch(`${urlProduct}/getAllProducts`, {
            method: "GET",
            headers: {
                'Content-Type': 'application/json',
                'jwt_token': localStorage.getItem('jwt_token')
            }
        })

        const data = await response.json()
        return data
    }

    const getCartProducts = async () => {
        const response = await fetch(`${urlBuyer}/getAllProducts`, {
            method: "GET",
            headers: {
                'Content-Type': 'application/json',
                'jwt_token': localStorage.getItem('jwt_token')
            }
        })

        const data = await response.json()
        return data
    }

    return (
        <ProductContext.Provider value={{urlAuth, getCartProducts, urlProduct, getAllVendorProducts, getVendorDetails, urlBuyer, urlProductType, getAllProductType, currentProduct, setCurrentProduct, getAllVendors, getAllProducts}}>
            {props.children}
        </ProductContext.Provider>
    )
}

export default ProductState