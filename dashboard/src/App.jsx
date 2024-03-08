import { BrowserRouter, Route, Routes } from 'react-router-dom'
import './App.css'
import Sidebar from './Components/Sidebar'
import Dashboard from './Pages/Dashboard.jsx';
import Products from './Pages/Products.jsx';
import Order from './Pages/Order.jsx';
import Message from './Pages/Message.jsx';
import Customer from './Pages/Customer.jsx';
import ErrorPage from './Pages/ErrorPage.jsx';
import NewProduct from './Pages/NewProduct.jsx';

function App() {

  return (
    <BrowserRouter>
      <Sidebar />
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/products" element={<Products />} />
        <Route path="/products/new" element={<NewProduct />} />
        <Route path="/orders" element={<Order />} />
        <Route path="/message" element={<Message />} />
        <Route path="/customer" element={<Customer />} />
        <Route path="*" element={<ErrorPage />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
