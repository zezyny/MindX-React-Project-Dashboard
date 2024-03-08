import React from 'react'
import Header from '../Components/Header'
import { Link } from 'react-router-dom'
import { Form } from 'antd';
export default function NewProduct() {
    // breadcrumb=====================
    const breadcrumb = [
        {
            title: <Link to={'/'}>Dashboard</Link>
        },
        {
            title: <Link to={'/products'}>Products</Link>
        },
        {
            title: 'New products'
        }
    ]
    return (
        <div>
            <Header title='Products' breadcrumb={breadcrumb} />
            <Form></Form>
        </div>
    )
}
