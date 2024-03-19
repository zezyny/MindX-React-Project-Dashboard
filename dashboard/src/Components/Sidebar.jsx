import React from 'react'
import { IoHome } from "react-icons/io5";
import { Menu } from 'antd';
import { FaBoxArchive, FaCartShopping, FaUserTag, FaMessage } from "react-icons/fa6";
import { Link } from 'react-router-dom';
export default function Sidebar() {
    function getItem(label, key, icon, children, type) {
        return {
            key,
            icon,
            children,
            label,
            type,
        };
    }
    const items = [
        getItem(<Link to={'/dashboard'}>Dashboard</Link>, '1', <IoHome />),
        getItem('Products', 'sub2', <FaBoxArchive />, [
            getItem(<Link to={'/products'}>All products</Link>, '2'),
            getItem(<Link to={'/products/new'}>Add new products</Link>, '3'),
        ]),
        getItem('Order', 'sub3', <FaCartShopping />, [
            getItem(<Link to={'/orders'}>Orders</Link>, '4'),
            getItem('New orders', '5'),
            getItem('Completed', '6'),
            getItem('Canceled', '7'),
        ]),
        getItem('Customers', 'sub4', <FaUserTag />, [
            getItem(<Link to={'/customer'}>All customers</Link>, '8'),
            getItem('Loyal customers', '9'),
            getItem('New customers', '10')
        ]),
        getItem('Message', 'sub5', <FaMessage />, [
            getItem('All message', '11'),
            getItem('Unread', '12'),
            getItem('Readed', '13')
        ]),
    ];

    return (
        <div className='nav-container'>
            <img src="https://websitedemos.net/furniture-shop-04/wp-content/uploads/sites/1116/2022/07/logo-regular.png" alt="logo" />
            <Menu
                defaultSelectedKeys={['1']}
                mode="inline"
                theme="dark"
                items={items}
            />
        </div>
    )
}
