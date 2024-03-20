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
    let singledoc = doc(customer, id)
    useEffect(() => {
        let getmess = async () => {
            const data = await getDoc(singledoc)
            setCtm(data.data())
        }
        getmess()
    }, [])
    // let [ctmCart, setCtmCart] = useState([])
    let ctmCart = []
    for (let i = 0; i < product?.length; i++) {
        for (let j = 0; j < ctm?.cart.length; j++) {
            if (product[i].id == ctm.cart[j].id) {
                let imgIndex = product[i].productColor.findIndex((item) => { return item.colorCode == ctm?.cart[j].color })
                let temp = {
                    product: product[i],
                    amount: ctm?.cart[j].amount,
                    color: ctm?.cart[j].color,
                    imgIndex: imgIndex,
                }
                ctmCart.push(temp)
            }
        }
    }
    // console.log(ctmCart);
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
            render: (text, record) => <Link to={`/products/detail/${record.key}`}>{text}</Link>
        },
        {
            title: 'Image',
            dataIndex: 'img',
            render: (text) => <Image src={text} style={{ width: '60px' }} />
        },
        {
            title: 'Color',
            dataIndex: 'color',
            align: 'center',
            render: (text, record) => <div style={{
                display: 'flex', flexDirection: 'column',
                alignItems: 'center'
            }}><div style={{ width: '30px', height: '30px', background: `${text}`, clipPath: 'circle(50%)' }}></div><p>{record.colorName.charAt(0).toUpperCase() + record.colorName.slice(1)}</p></div>
        },
        {
            title: 'Amount',
            dataIndex: 'amount',
            align: 'center'
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
            title: 'Subtotal',
            dataIndex: 'subTotal',
            align: 'center',
            render: (text) => <p>${text}</p>
        }
    ]
    let dataTable = ctmCart.map((item, index) => {
        return {
            index: index + 1,
            key: item.product.id,
            productName: item.product.productName,
            img: item.product.img[item.imgIndex],
            color: item.color,
            colorName: item.product.productColor[item.imgIndex].nameColor,
            amount: item.amount,
            price: item.product.price,
            discount: item.product.discount,
            subTotal: `${item.product.price * item.amount * (100 - item.product.discount) / 100}`
        }
    })
    // console.log(dataTable);
    const items = [
        {
            key: '1',
            label: 'Customer Name',
            children: `${ctm?.costumer.firstname} ${ctm?.costumer.lastname}`
        },
        {
            key: '2',
            label: 'Customer ID',
            children: `${id.toUpperCase()}`
        },
        {
            key: '3',
            label: 'Email',
            children: <a href={`mailto:${ctm?.costumer.customer}`}>{ctm?.costumer.customer}</a>
        },
        {
            key: '4',
            label: 'Phone',
            children: <a href={`tel:${ctm?.costumer.phone}`}>{ctm?.costumer.phone}</a>
        },
        {
            key: '5',
            label: 'Note',
            children: ctm?.costumer.note
        },
        {
            key: '6',
            label: 'Address',
            children: `${ctm?.costumer.house}, ${ctm?.costumer.towncity}, ${ctm?.costumer.state}, ${ctm?.costumer.country}, ZIP Code: ${ctm?.costumer.zip}`
        },
    ]
    const renderCtmInfo = () => {
        return <Descriptions
            title='Customer Info'
            items={items}
            style={{
                backgroundColor: 'var(--background1)',
                padding: '30px',
                borderRadius: '20px'
            }}
        />
    }
    const renderCtmCart = () => {
        return <div
            style={{
                backgroundColor: 'var(--background1)',
                padding: '30px',
                borderRadius: '20px',
                marginTop: '20px'
            }}>
            <h4 style={{ marginBottom: '30px' }}>{`${ctm?.costumer.firstname}'s Order`}</h4>
            <Table
                dataSource={dataTable}
                columns={columns}
                title={() => <Descriptions items={
                    [
                        {
                            key: '1',
                            label: 'Order ID',
                            children: ctm?.costumer.id.toUpperCase()
                        },
                        {
                            key: '2',
                            label: 'Date',
                            children: ctm?.costumer.date
                        }
                    ]
                } />}
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
                        <Table.Summary.Cell index={8}>${sum}</Table.Summary.Cell>
                    </Table.Summary.Row>
                }}
            >

            </Table>
        </div>
    }

    const breadcrumb = [
        {
            title: <Link to={'/dashboard'}>Dashboard</Link>
        },
        {
            title: <Link to={'/customer'}>Customers</Link>
        },
        {
            title: <span style={{ color: 'var(--main)' }}>{`${ctm?.costumer?.firstname} ${ctm?.costumer?.lastname}`}</span>
        }
    ]
    return (
        <div>
            <Header title={`${ctm?.costumer?.firstname} ${ctm?.costumer?.lastname}`} breadcrumb={breadcrumb} />
            <div className='body-content'>
                {renderCtmInfo()}
                {renderCtmCart()}
            </div>
        </div>
    )
}
