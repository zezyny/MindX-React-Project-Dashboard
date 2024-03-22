import { BrowserRouter, Route, Routes } from 'react-router-dom'
import './App.css'
import Sidebar from './Components/Sidebar'
import Dashboard from './Pages/Dashboard.jsx';
import Products from './Pages/Products.jsx';
import Order from './Pages/Order.jsx';
import Customer from './Pages/Customer.jsx';
import ErrorPage from './Pages/ErrorPage.jsx';
import NewProduct from './Pages/NewProduct.jsx';
import DetailProduct from './Pages/DetailProduct.jsx';
import Result from './Pages/Result.jsx';
import Login from './Pages/Login.jsx';
import DetailCustomer from './Pages/DetailCustomer.jsx';
import Permission from './Pages/Permission.jsx';

function App() {

  return (
    <BrowserRouter>
      <Sidebar />
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/products" element={<Products />} />
        <Route path="/products/new" element={<NewProduct />} />
        <Route path="/result" element={<Result />} />
        <Route path="/products/detail/:id" element={<DetailProduct />} />
        <Route path="/orders" element={<Order />} />
        <Route path="/customer" element={<Customer />} />
        <Route path="/permission" element={<Permission />} />
        <Route path="/customer/detail/:id" element={<DetailCustomer />} />
        <Route path="*" element={<ErrorPage />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
