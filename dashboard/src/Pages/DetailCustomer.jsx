import React, { useContext, useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { FirebaseContext } from '../Context/FirebaseProvider'
import { doc, getDoc, onSnapshot, query } from 'firebase/firestore'
import Header from '../Components/Header'
import { Descriptions, Image, Table } from 'antd'

export default function DetailCustomer() {
    const { id } = useParams()
    let [ctm, setCtm] = useState(null)
    let [product, setProduct] = useState([])
    const { customer, messCollect } = useContext(FirebaseContext)
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
    // console.log(ctm);
    let [ctmCart, setCtmCart] = useState([])
    let temp = []
    useEffect(() => {
        temp = ctm?.filter((item) => {
            return item.costumer.customer === id
        }
        )
        for (let i = 0; i < temp?.length; i++) {
            for (let j = 0; j < temp[i]?.cart.length; j++) {
                for (let k = 0; k < product.length; k++) {

                    if (product[k].id == temp[i]?.cart[j].id) {
                        Object.assign(temp[i].cart[j], product[k])
                    }
                }
            }
        }
        // return temp
        setCtmCart(temp)
    }, [ctm])
    console.log(ctmCart);
    const columns = [
        {
            title: 'No.',
            dataIndex: 'index',
            align: 'center'
        },
        {
            title: 'Product ID',
            dataIndex: 'key',
            render: (text, record) => <Link to={`/products/detail/${record.key}`}>{text.toUpperCase()}</Link>
        },
        {
            title: 'Product Name',
            dataIndex: 'productName',
            align: 'center',
            width: '20%',
            render: (text, record) => <Link to={`/products/detail/${record.key}`}>{text}</Link>
        },
        {
            title: 'Image',
            dataIndex: 'img',
            align: 'center',
            width: '10%',
            render: (text) => <Image src={text} style={{ width: '60px' }} />
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
            dataIndex: 'subTotal',
            align: 'center',
            width: '10%',
            render: (text) => <p>${text}</p>
        }
    ]

    const renderCtmInfo = () => {
        return <Descriptions
            title='Customer Info'
            items={
                [
                    {
                        key: ctmCart[0]?.id + 1,
                        label: 'Customer ID',
                        children: ctmCart[0]?.id.toUpperCase()
                    },
                    {
                        key: ctmCart[0]?.id + 2,
                        label: 'Customer Name',
                        children: `${ctmCart[0]?.costumer.firstname} ${ctmCart[0]?.costumer.lastname}`
                    },
                    {
                        key: ctmCart[0]?.id + 3,
                        label: 'Email',
                        children: ctmCart[0]?.costumer.customer
                    },
                ]}
            style={{
                backgroundColor: 'var(--background1)',
                padding: '30px',
                borderRadius: '10px'
            }}
        />
    }
    const renderCtmCart = () => {
        return ctmCart?.map((item) => {
            let dataTable = item?.cart.map((it, index) => {
                let imgIndex = it?.productColor.findIndex((i) => i.colorCode == it.color)
                // console.log(imgIndex);
                return {
                    index: index + 1,
                    key: it.id,
                    productName: it.productName,
                    img: it.img[imgIndex],
                    color: it.color,
                    colorName: it.productColor[imgIndex].nameColor,
                    amount: it.amount,
                    price: it.price,
                    discount: it.discount,
                    subTotal: `${it.price * it.amount * (100 - it.discount) / 100}`
                }
            })
            return <Table
                key={item.id}
                style={{ margin: '30px 0' }}
                pagination={{ position: ['none'] }}
                title={() => <Descriptions
                    items={
                        [
                            {
                                key: item.id + 1,
                                label: 'Order ID',
                                children: item.id.toUpperCase()
                            },
                            {
                                key: item.id + 2,
                                label: 'Address',
                                children: `${item.costumer.company}, ${item.costumer.towncity}, ${item.costumer.state}, ${item.costumer.country}, ${item.costumer.zip}`
                            },
                            {
                                key: item.id + 3,
                                label: 'Phone Number',
                                children: item.costumer.phone
                            },
                            {
                                key: item.id + 4,
                                label: 'Date of Order',
                                children: item.costumer.date
                            }
                        ]
                    }
                />}
                dataSource={dataTable}
                columns={columns}
                summary={(pageData) => {
                    let sum = 0
                    pageData.forEach(({ subTotal }) => {
                        sum += Number(subTotal)
                    })

                    return <Table.Summary.Row>
                        <Table.Summary.Cell index={0}></Table.Summary.Cell>
                        <Table.Summary.Cell index={1}><p style={{ fontWeight: 'bold' }}>SUMMARY</p></Table.Summary.Cell>
                        <Table.Summary.Cell index={2}></Table.Summary.Cell>
                        <Table.Summary.Cell index={3}></Table.Summary.Cell>
                        <Table.Summary.Cell index={4}></Table.Summary.Cell>
                        <Table.Summary.Cell index={5}></Table.Summary.Cell>
                        <Table.Summary.Cell index={6}></Table.Summary.Cell>
                        <Table.Summary.Cell index={7}></Table.Summary.Cell>
                        <Table.Summary.Cell index={8} align='center'>${sum.toFixed(2)}</Table.Summary.Cell>
                    </Table.Summary.Row>
                }}
            >

            </Table>
        })
    }

    const breadcrumb = [
        {
            title: <Link to={'/dashboard'}>Dashboard</Link>
        },
        {
            title: <Link to={'/customer'}>Customers</Link>
        },
        {
            title: <span style={{ color: 'var(--main)' }}>Detail Customer</span>
        }
    ]
    return (
        <div>
            <Header title={id} breadcrumb={breadcrumb} />
            <div className='body-content'>
                {/* {renderCtmInfo()} */}
                {renderCtmCart()}
            </div>
        </div>
    )
}
