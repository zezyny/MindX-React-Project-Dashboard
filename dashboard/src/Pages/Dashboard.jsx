import React, { useContext, useEffect, useState } from 'react'
import Header from '../Components/Header'
import { FirebaseContext } from '../Context/FirebaseProvider'
import { onSnapshot, query } from 'firebase/firestore'
import { Image, List, Table } from 'antd'

export default function Dashboard() {
    const { customer, messCollect } = useContext(FirebaseContext)
    const [ctm, setCtm] = useState([])
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
            setCtm(temp)
        });
    }, [])
    ctm.forEach((item) => {
        for (let i = 0; i < product.length; i++) {
            for (let j = 0; j < item.cart.length; j++) {
                if (product[i].id == item.cart[j].id) {
                    let qtt = 0
                    qtt += item.cart[j].amount
                    product[i] = {
                        ...product[i],
                        saleQtt: qtt
                    }
                }
            }
        }
    })
    const columns = [
        {
            title: 'Product Name',
            dataIndex: 'productName',
            render: (text, record) => <a href={`/products/detail/${record.key}`}>{text}</a>
        },
        {
            title: 'Image',
            dataIndex: 'img',
            align: 'center',
            render: (text) => <Image src={text} style={{ width: '70px' }} />
        },
        {
            title: 'Price',
            dataIndex: 'price',
            align: 'center',
            render: (text) => <p>${text}</p>
        },
        {
            title: 'Discount',
            dataIndex: 'discount',
            align: 'center',
            render: (text) => <p>{text}%</p>
        },
        {
            title: 'Sold',
            dataIndex: 'qtt',
            align: 'center',
            sorter: (a, b) => a.qtt - b.qtt,
            sortOrder: 'descend',
        }
    ]

    let dataTable = product.map((item) => {
        return {
            key: item.id,
            productName: item.productName,
            img: item.img[0],
            price: item.price,
            discount: item.discount,
            qtt: item.saleQtt ? item.saleQtt : 0
        }
    })
    return (
        <div>
            <Header title='Dashboard' />
            <div className='body-content'>
                <h4
                    style={{ marginBottom: '10px' }}
                >Best seller</h4>
                <Table
                    dataSource={dataTable}
                    columns={columns}
                    pagination={{ position: ['none'], pageSize: 5 }}
                >

                </Table>

            </div>
        </div>
    )
}
