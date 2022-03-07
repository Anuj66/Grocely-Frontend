import Navbar from "./components/Navbar";
import Login from "./components/Login";
import {Routes, Route} from 'react-router-dom'
import ProductState from "./context/Product/ProductState";
import Signup from "./components/Signup";
import Home from "./components/Home";
import Aboutus from "./components/Aboutus";
import UserHome from "./components/UserHome";
import VendorHome from './components/VendorHome'
import VendorLogin from './components/VendorLogin'
import UserLogin from './components/UserLogin'
import VendorSignup from "./components/VendorSignup";
import UserSignup from "./components/UserSignup";
import AddProduct from './components/AddProduct';
import UpdateProduct from './components/UpdateProduct';
import UserCart from "./components/UserCart";

function App() {
  return (
    <div>
        <ProductState>
            <Navbar />
            <Routes>
                <Route exact path={"/"} element={<Home></Home>}></Route>
                <Route exact path={"/login"} element={<Login></Login>}></Route>
                <Route exact path={"/signup"} element={<Signup></Signup>}></Route>
                <Route exact path={"/aboutus"} element={<Aboutus></Aboutus>}></Route>
                <Route exact path={"/userhome"} element={<UserHome></UserHome>}></Route>
                <Route exact path={"/vendorhome"} element={<VendorHome></VendorHome>}></Route>
                <Route exact path={"/vendorlogin"} element={<VendorLogin></VendorLogin>}></Route>
                <Route exact path={"/userlogin"} element={<UserLogin></UserLogin>}></Route>
                <Route exact path={"/vendorsignup"} element={<VendorSignup></VendorSignup>}></Route>
                <Route exact path={"/usersignup"} element={<UserSignup></UserSignup>}></Route>
                <Route exact path={"/addproduct"} element={<AddProduct />}></Route>
                <Route exact path={"/updateproduct"} element={<UpdateProduct />}></Route>
                <Route exact path={"/usercart"} element={<UserCart />}></Route>
            </Routes>
        </ProductState>
    </div>
  );
}

export default App;
