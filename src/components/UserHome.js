import React, {useContext, useEffect, useRef, useState} from 'react'
import Context from '../context/Product/ProductContext'
import {Link, useNavigate} from "react-router-dom";
import Alert from "./Alert";

const UserHome = () => {

    const context = useContext(Context)
    const {getAllProductType,getAllVendors, getAllProducts, urlBuyer, getCartProducts} = context
    const [products, setProducts] = useState([])
    const navigator = useNavigate()
    const [quantity, setQuantity] = useState(0)
    const refOpen = useRef(null)
    const refClose = useRef(null)
    const [prod, setProd] = useState({id: '', name: '', vendor: '', type: '', stock: '', price: '', quantity: ''})
    const [invalid, setInvalid] = useState(false)
    const [error, setError] = useState('Please enter the correct values!')

    useEffect(async () => {
        if(localStorage.getItem('jwt_token') && localStorage.getItem('role') === 'User'){
            let tempProducts = await getAllProducts()
            let tempProductTypes = await getAllProductType()
            let tempVendors = await getAllVendors()
            let tempCartProducts = await getCartProducts()

            tempProducts.forEach(obj => ({ ...obj, addedToCart: false}))

            tempProducts.forEach((product) => {
                let productType = tempProductTypes.filter((productType) => {return productType._id === product.type})
                let vendor = tempVendors.filter((vendor) => {return vendor._id === product.vendor})
                let cartProduct = tempCartProducts.filter((cartProduct) => {return cartProduct.product === product._id})
                if(cartProduct.length > 0){
                    product.addedToCart = true
                }
                product.type = productType[0].name
                product.vendor = vendor[0].name
            })
            setProducts(tempProducts)
        }else{
            alert('You are not authenticated')
            navigator('/login')
        }
    }, [])

    const onChange = (e) => {
        setQuantity(e.target.value)
    }

    const handleCartClick = (product) => {
        setInvalid(false)
        refOpen.current.click()
        setQuantity(0)
        setProd({id: product._id, name: product.name, type: product.type, vendor: product.vendor, stock: product.stock, price: product.price})
    }

    const addToCart = async () => {
        if(quantity <= 0){
            setInvalid(true)
            setError('Please enter a valid Quantity!')
        }else if(quantity > prod.stock){
            setInvalid(true)
            setError('Quantity entered is more than stock!, Please enter less than stock')
        }else{
            const response = await fetch(`${urlBuyer}/addProduct`, {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json',
                    'jwt_token': localStorage.getItem('jwt_token')
                },
                body: JSON.stringify({product: prod.id, quantity: quantity})
            })
            const data = await response.json()
            let temp = products
            temp.forEach((product) => {
                if(product._id === data.product){
                    product.addedToCart = true
                }
            })
            setProducts((temp))
            refClose.current.click()
            navigator('/userhome')
            alert('Added to Cart Successfully')
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
                            <h5 className="modal-title" id="exampleModalLabel">Add Quantity</h5>



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
                            <button type="button" className="btn btn-primary" onClick={addToCart}>Add To Cart</button>
                        </div>
                    </div>
                </div>
            </div>

            <h3 className={"my-3"}>List of Available Products</h3>
            <table className="table">
                <thead>
                <tr>
                    <th scope="col">#</th>
                    <th scope="col">Name</th>
                    <th scope="col">Type</th>
                    <th scope="col">Vendor</th>
                    <th scope="col">Price</th>
                    <th scope="col">Stock</th>
                    <th scope="col">Add to Cart</th>
                </tr>
                </thead>
                <tbody>
                {products.map((product, index) => {
                    return <tr>
                        <th>{index+1}</th>
                        <td>{product.name}</td>
                        <td>{product.type}</td>
                        <td>{product.vendor}</td>
                        <td><i className="fa-solid fa-indian-rupee-sign" />{product.price}</td>
                        <td>{product.stock}</td>
                        <td>{product.addedToCart?<label>Already in the cart</label>:<i className="fa-solid fa-cart-plus" style={{cursor: 'pointer'}} onClick={() => {handleCartClick(product)}}></i>}</td>
                    </tr>
                })}

                </tbody>
            </table>

            <Link className={"btn btn-primary my-3"} to={"/usercart"}>Go to Cart</Link>
        </div>
    )
}

export default UserHome