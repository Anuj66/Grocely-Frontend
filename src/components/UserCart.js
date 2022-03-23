import React, {useContext, useEffect, useRef, useState} from 'react'
import Context from '../context/Product/ProductContext'
import {Link, useNavigate} from "react-router-dom";
import Alert from "./Alert";

const UserCart = () => {

    const context = useContext(Context)
    const {urlBuyer, getAllVendors, getAllProducts, getCartProducts, urlProduct} = context
    const [products, setProducts] = useState([])
    const refOpen = useRef(null)
    const refClose = useRef(null)
    const [quantity, setQuantity] = useState(0)
    const [prod, setProd] = useState({id: '', stock: ''})
    const navigator = useNavigate()
    const [totalAmount, setTotalAmount] = useState(0)
    const [invalid, setInvalid] = useState(false)
    const [error, setError] = useState('Please enter the correct values!')

    useEffect(async () => {
        let tempCartProducts = await getCartProducts()
        let tempVendors = await getAllVendors()
        let tempProducts = await getAllProducts()

        tempCartProducts.forEach(obj => ({ ...obj, vendor: '', stock: '', price: '', name: '', type: '', vendorId: ''}))

        tempCartProducts.forEach((cartProduct) => {
            let product = tempProducts.filter((product) => {return product._id === cartProduct.product})
            let vendor = tempVendors.filter((vendor) => {return vendor._id === product[0].vendor})
            cartProduct.name = product[0].name
            cartProduct.vendor = vendor[0].name
            cartProduct.stock = product[0].stock
            cartProduct.price = product[0].price
            cartProduct.type = product[0].type
            cartProduct.vendorId = product[0].vendor
        })

        setProducts(tempCartProducts)
        calculateTotalAmount()
    }, [products])

    useEffect(() => {
        calculateTotalAmount()
    }, [totalAmount])

    const calculateTotalAmount = () => {
        let sum = 0
        products.forEach((product) => { sum = sum + product.price * product.quantity })
        setTotalAmount(sum)
    }

    const deleteProduct = async (id) => {
        const response = await fetch(`${urlBuyer}/deleteProduct/${id}`, {
            method: "DELETE",
            headers: {
                'Content-Type': 'application/json',
                'jwt_token': localStorage.getItem('jwt_token')
            }
        })
        const data = await response.json()
        let temp = products.filter((product) => {return product.product !== id})
        setProducts(temp)
        calculateTotalAmount()
        alert('Deleted Successfully')
        return data
    }

    const handleUpdateClick = (product) => {
        setInvalid(false)
        refOpen.current.click()
        setQuantity(product.quantity)
        setProd({id: product.product, stock: product.stock})
    }

    const onChange = (e) => {
        setQuantity(e.target.value)
    }

    const updateCart = async () => {

        if(quantity <= 0){
            setInvalid(true)
            setError('Please enter a valid Quantity!')
        }else if(quantity > prod.stock){
            setInvalid(true)
            setError('Quantity entered is more than stock!, Please enter less than stock')
        }else{
            const response = await fetch(`${urlBuyer}/updateProduct/${prod.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'jwt_token': localStorage.getItem('jwt_token')
                },
                body: JSON.stringify({quantity: quantity})
            })

            const data = await response.json()
            if(data.success){
                let temp = products
                temp.forEach((product) => {
                    if(product.product === prod.id){
                        product.quantity = data.updatedProduct.quantity
                    }
                })
                setProducts(temp)
                calculateTotalAmount()
                alert('Product updated successfully')
                refClose.current.click()
            }else{
                alert(data.error)
            }
        }

    }

    const updateProduct = async (product) => {

        product.stock = product.stock - product.quantity

        const response = await fetch(`${urlProduct}/updateUserProduct/${product.product}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'jwt_token': localStorage.getItem('jwt_token')
            },
            body: JSON.stringify({ name: product.name, type: product.type, vendor: product.vendorId, stock: product.stock, price: product.price })
        })
        const data = await response.json()
        return data
    }

    const handleCheckout = async () => {

        let temp = products
        for (let product of temp) {
            await updateProduct(product)
        }

        const response = await fetch(`${urlBuyer}/deleteCart`, {
            method: "DELETE",
            headers: {
                'Content-Type': 'application/json',
                'jwt_token': localStorage.getItem('jwt_token')
            }
        })

        const data = await response.json()
        if(data.success){
            setProducts([])
            calculateTotalAmount()
            alert('Payment is approved, your order will get to you soon!')
            navigator('/userhome')
        }else{
            alert(data.error)
        }
    }

    return (
        <div className={"container"}>

            <button ref={refOpen} type="button" className="btn btn-primary d-none" data-bs-toggle="modal"
                    data-bs-target="#exampleModal">
                Launch demo modal
            </button>

            <div className="modal fade" id="exampleModal" tabIndex="-1" aria-labelledby="exampleModalLabel"
                 aria-hidden="true">
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title" id="exampleModalLabel">Update Quantity</h5>
                            <button type="button" className="btn-close" data-bs-dismiss="modal"
                                    aria-label="Close"></button>
                        </div>
                        <div className="modal-body">
                            <div className="mb-3">
                                <Alert invalid={invalid} error={error}/>
                                <label htmlFor="quantity" className="form-label">Quantity</label>
                                <input type="number" className="form-control" id="quantity" name={"quantity"} onChange={onChange} value={quantity} required={true}/>
                            </div>
                        </div>
                        <div className="modal-footer">
                            <button ref={refClose} type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                            <button type="button" className="btn btn-primary" onClick={updateCart}>Update Cart</button>
                        </div>
                    </div>
                </div>
            </div>

            <h3 className={"my-3"}>Your Cart</h3>
            <table className="table">
                <thead>
                <tr>
                    <th scope="col">#</th>
                    <th scope="col">Product</th>
                    <th scope="col">Quantity</th>
                    <th scope="col">Vendor</th>
                    <th scope={"col"}>Available Stock</th>
                    <th scope={"col"}>Price per Unit</th>
                    <th scope={"col"}>Total Amount</th>
                    <th scope={"col"}>Edit</th>
                    <th scope={"col"}>Delete</th>
                </tr>
                </thead>
                <tbody>
                {products.length === 0 && <h5 className={"my-3"}>No Product in the Cart!</h5>}
                {products.length>0 && products.map((product, index) => {
                    return <tr>
                        <th scope="row">{index + 1}</th>
                        <td>{product.name}</td>
                        <td>{product.quantity}</td>
                        <td>{product.vendor}</td>
                        <td>{product.stock}</td>
                        <td><i className="fa-solid fa-indian-rupee-sign"></i> {product.price}</td>
                        <td><i className="fa-solid fa-indian-rupee-sign"></i> {product.price * product.quantity}</td>
                        <td><i className="fa-solid fa-pen" style={{cursor: 'pointer'}} onClick={() => {handleUpdateClick(product)}}></i></td>
                        <td><i className="fa-solid fa-trash" style={{cursor: 'pointer'}} onClick={() => {deleteProduct(product.product)}}></i></td>
                    </tr>
                })}
                </tbody>
            </table>

            <div className="d-flex bd-highlight mb-3 my-3">
                <div className="me-auto p-2 bd-highlight">
                    <Link className={"btn btn-primary"} to={"/userhome"}>Go to Home</Link>
                </div>
                <div className="p-2 bd-highlight">
                    <label className={"mx-3 my-2"}>Total Amount : <i className="fa-solid fa-indian-rupee-sign" /> {totalAmount}</label>
                </div>
                <div className="p-2 bd-highlight">
                    <button className={'btn btn-primary mx-3'} disabled={totalAmount === 0 ? true : false} onClick={handleCheckout}>Proceed to Checkout</button>
                </div>
            </div>

        </div>
    )
}

export default UserCart