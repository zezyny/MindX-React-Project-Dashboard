import React, { useContext, useEffect, useState } from 'react'
import Header from '../Components/Header'
import { Descriptions, Image, Table } from 'antd'
import { onSnapshot, query } from 'firebase/firestore'
import { FirebaseContext } from '../Context/FirebaseProvider'
import { Link } from 'react-router-dom'

export default function Order() {
    const { customer, messCollect } = useContext(FirebaseContext)
    const [customers, setCustomers] = useState([])
    let [product, setProduct] = useState([])
    useEffect(() => {
        const q = query(messCollect);
        const unsubscribe = onSnapshot(q, (querySnapshot) => {
            const temp = [];
            querySnapshot.forEach((doc) => {
                temp.push({ ...doc.data(), id: doc.id });
            });
            setProduct(temp)
        });
    }, [])
    useEffect(() => {
        const q = query(customer);
        const unsubscribe = onSnapshot(q, (querySnapshot) => {
            const temp = [];
            querySnapshot.forEach((doc) => {
                temp.push({ ...doc.data(), id: doc.id });
            });
            setCustomers(temp)
        });
    }, [])

    customers.forEach((item) => {
        for (let i = 0; i < product.length; i++) {
            for (let j = 0; j < item.cart.length; j++) {
                if (product[i].id == item.cart[j].id) {
                    let imgIndex = product[i].productColor.findIndex((it) => { return it.colorCode == item.cart[j].color })
                    item.cart[j] = {
                        ...item.cart[j],
                        productName: product[i].productName,
                        price: product[i].price,
                        discount: product[i].discount,
                        img: product[i].img,
                        productColor: product[i].productColor,
                        indexImg: imgIndex
                    }
                }
            }
        }
    })

    const columns = [
        {
            title: 'ID',
            dataIndex: 'key',
            width: '10%',
            render: (text) => <p>{text.toUpperCase()}</p>
        },
        {
            title: 'Customer Name',
            dataIndex: 'customerName',
            width: '20%',
            sorter: (a, b) => a.customerName.localeCompare(b.customerName),
            key: 'customerName',
        },
        {
            title: 'Email',
            dataIndex: 'mail',
            render: (text) => <a href={`mailto:${text}`}>{text}</a>
        },
        {
            title: 'Date',
            dataIndex: 'date',
            sorter: (a, b) => new Date(a.date) - new Date(b.date),
            defaultSortOrder: 'descend',
        },
        {
            title: 'Total',
            dataIndex: 'total',
            align: 'center',
            width: '10%',
            render: (text) => <p>${text.toFixed(2)}</p>
        }
    ]
    let dataTable = customers.map((item) => {
        let sum = 0
        item.cart.forEach((it) => sum += it.price * it.amount * (100 - it.discount) / 100)
        return {
            id: item.id,
            key: item.id,
            customerName: `${item.costumer.firstname} ${item.costumer.lastname}`,
            mail: item.costumer.customer,
            phone: item.costumer.phone,
            date: item.costumer.date,
            total: sum,
            cart: item.cart,
            note: item.costumer.note,
            address: `${item.costumer.house}, ${item.costumer.towncity}, ${item.costumer.state}, ${item.costumer.country}, ${item.costumer.zip}`,
            // order: item.order
        }
    })
    const breadcrumb = [
        {
            title: <Link to={'/dashboard'}>Dashboard</Link>
        },
        {
            title: <span style={{ color: 'var(--main)' }}>Orders</span>
        }
    ]
    return (
        <div>
            <Header title={`Order - Total: ${customers.length + 1}`} breadcrumb={breadcrumb} />
            <div className='body-content'>
                <Table
                    bordered
                    pagination={{ position: ['bottomCenter'], total: `${customers.length + 1}`, showTotal: (total) => { `Total ${total} orders` } }}
                    dataSource={dataTable}
                    columns={columns}
                    expandable={{
                        expandRowByClick: true,
                        expandedRowRender: (record) => {
                            return <div
                                style={{
                                    backgroundColor: '#fff',
                                    padding: '30px',
                                    margin: '0',
                                    border: '1px solid var(--main)',
                                    borderRadius: '10px'
                                }}
                            >
                                <Descriptions
                                    items={[
                                        {
                                            key: '1',
                                            label: 'Address',
                                            children: record.address
                                        },
                                        {
                                            key: '2',
                                            label: 'Phone',
                                            children: <a href={`tel:${record.phone}`}>{record.phone}</a>
                                        },
                                        {
                                            key: '3',
                                            label: 'Note',
                                            children: record.note
                                        },
                                    ]}
                                />
                                <Table
                                    bordered
                                    style={{
                                        marginBottom: '30px'
                                    }}
                                    pagination={{ position: ['none'] }}
                                    dataSource={record.cart.map((it, index) => {
                                        return {
                                            key: index,
                                            productName: it.productName,
                                            img: it.img[it.indexImg],
                                            color: it.color,
                                            amount: it.amount,
                                            price: it.price,
                                            discount: it.discount,
                                            subtotal: it.price * it.amount * (100 - it.discount) / 100,
                                            id: record.id,
                                            colorName: it.productColor[it.indexImg].nameColor
                                        }
                                    })}
                                    columns={[
                                        {
                                            title: 'Product List',
                                            dataIndex: 'productName',
                                            render: (text, record) => <Link to={`/products/detail/${record.id}`}>{text}</Link>
                                        },
                                        {
                                            title: 'Image',
                                            dataIndex: 'img',
                                            align: 'center',
                                            width: '10%',
                                            render: (text) => <Image src={text} style={{ width: '50px' }} />
                                        },
                                        {
                                            title: 'Color',
                                            dataIndex: 'color',
                                            align: 'center',
                                            width: '10%',
                                            render: (text, record) => <div style={{
                                                display: 'flex', flexDirection: 'column',
                                                alignItems: 'center'
                                            }}><div style={{
                                                width: '25px', height: '25px', background: `${text}`, clipPath: 'circle(50%)', marginBottom: '3px'
                                            }}></div><p>{record.colorName.charAt(0).toUpperCase() + record.colorName.slice(1)}</p></div>
                                        },
                                        {
                                            title: 'Amount',
                                            dataIndex: 'amount',
                                            align: 'center',
                                            width: '10%',
                                        },
                                        {
                                            title: 'Price',
                                            dataIndex: 'price',
                                            align: 'center',
                                            width: '10%',
                                            render: (text) => <p>${text}</p>
                                        },
                                        {
                                            title: 'Discount',
                                            dataIndex: 'discount',
                                            align: 'center',
                                            width: '10%',
                                            render: (text) => <p>{text}%</p>
                                        },
                                        {
                                            title: 'Subtotal',
                                            dataIndex: 'subtotal',
                                            align: 'center',
                                            width: '10%',
                                            render: (text) => <p>${text.toFixed(2)}</p>
                                        }

                                    ]}
                                >

                                </Table>
                            </div>
                        }
                    }}
                >

                </Table>
            </div>
        </div>
    )
}
