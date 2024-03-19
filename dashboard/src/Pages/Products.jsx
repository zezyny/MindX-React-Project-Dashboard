import React, { useContext, useEffect, useState } from 'react'
import Header from '../Components/Header'
import { MdDelete, MdModeEditOutline } from "react-icons/md";
import { FirebaseContext } from '../Context/FirebaseProvider'
import { deleteDoc, doc, onSnapshot, query } from 'firebase/firestore'
import { Table, Button, Image, Input, Popconfirm, Tag } from 'antd'
import { Link, useNavigate } from 'react-router-dom'
import Column from 'antd/es/table/Column';
export default function Products() {
    const navigate = useNavigate()
    let [product, setProduct] = useState([])
    const [searchInput, setSearchInput] = useState("")
    const { messCollect } = useContext(FirebaseContext)
    useEffect(() => {
        const q = query(messCollect);
        const unsubscribe = onSnapshot(q, (querySnapshot) => {
            const temp = [];
            querySnapshot.forEach((doc) => {
                temp.push({ ...doc.data(), id: doc.id });
            });
            setProduct(temp)
        });
    }, [searchInput])
    console.log(product);
    // handle table================================
    const columns = [
        {
            title: 'Image',
            dataIndex: 'img',
            width: '10%',
            align: 'center'
        },
        {
            title: 'Product',
            dataIndex: 'products',
            sorter: (a, b) => a.products.localeCompare(b.products),
            width: '30%',
            render: (text, record) => <Link to={`/products/detail/${record.key}`}>{text}</Link>
        },
        {
            title: 'Category',
            dataIndex: 'category',
            width: '15%',
            filters: [
                {
                    value: 'Decor',
                    text: 'Decor'
                },
                {
                    value: 'Bedroom',
                    text: 'Bedroom'
                },
                {
                    value: 'Office',
                    text: 'Office'
                },
                {
                    value: 'Living Room',
                    text: 'Living Room'
                },
            ],
            filterSearch: true,
            onFilter: (value, record) => record.category.includes(value),
            render: (_, { category }) => (
                <div>
                    {category.map((category) => {
                        let color = ''
                        if (category === 'Decor') {
                            color = 'red';
                        }
                        if (category === 'Bedroom') {
                            color = 'blue';
                        }
                        if (category === 'Office') {
                            color = 'gold';
                        }
                        if (category === 'Living Room') {
                            color = 'green';
                        }
                        return <Tag style={{ marginTop: '5px' }} color={color} key={category}>{category}</Tag>
                    })}
                </div>
            )
        },
        {
            title: 'Stock',
            dataIndex: 'stock',
            sorter: (a, b) => a.stock - b.stock,
            width: '10%',
            align: 'center'
        },
        {
            title: 'Price',
            dataIndex: 'price',
            sorter: (a, b) => a.price - b.price,
            width: '10%',
            align: 'center',
            render: (text) => <p>${text}</p>
        },
        {
            title: 'Discount',
            dataIndex: 'discount',
            width: '10%',
            align: 'center'
        },
        {
            title: 'Delete',
            dataIndex: 'delete',
            width: '10%',
            align: 'center'
        },
    ]
    let dataTable = product.map((item) => {
        return {
            key: `${item.id}`,
            products: `${item.productName}`,
            img:
                <Image.PreviewGroup
                    items={[
                        `${item.img[0]}`,
                        `${item.img[1]}`,
                        `${item.img[2]}`
                    ]}
                >
                    <Image src={item.img[0]} width={'70%'} />
                </Image.PreviewGroup>
            ,
            category: item.categories,
            price: `${item.price}`,
            discount: `${item.discount}%`,
            stock: `${item.stock}`,
            delete: <div>
                <Popconfirm
                    title="Delete the task"
                    description="Are you sure to delete this product?"
                    okText="Yes"
                    cancelText="No"
                    onConfirm={() => { handleDelete(item.id) }}
                >
                    <Button danger style={{ fontSize: '16px' }}><MdDelete /></Button>
                </Popconfirm>
            </div>
        }
    })

    // handle search=================================
    const handleChangeInput = (e) => {
        setSearchInput(e.target.value)
    }
    const handleSearch = () => {
        let productFiltered = product.filter((item) => {
            return item.productName.toLowerCase().includes(searchInput.toLowerCase())
        })
        console.log(productFiltered);
        setProduct(productFiltered)
    }

    // handle delete
    const handleDelete = async (id) => {
        await deleteDoc(doc(messCollect, id));
    }


    // breadcrumb=====================
    const breadcrumb = [
        {
            title: <Link to={'/dashboard'}>Dashboard</Link>
        },
        {
            title: <span style={{ color: 'var(--main)' }}>Products</span>
        }
    ]
    return (
        <div>
            <Header title='Products' breadcrumb={breadcrumb} />
            <div className="body-content" >
                <div style={{ display: 'flex', justifyContent: 'space-between', gap: '10px' }}>
                    <Input.Search
                        placeholder='Search products...'
                        enterButton
                        style={{ flex: 6, margin: '10px 0' }}
                        value={searchInput}
                        onChange={handleChangeInput}
                        onSearch={handleSearch}
                    />
                    <Button
                        type='primary'
                        style={{ flex: 1, margin: '10px 0' }}
                        onClick={() => { navigate('/products/new') }}
                    >
                        Add new product
                    </Button>
                </div>
                <Table
                    columns={columns}
                    dataSource={dataTable}
                    pagination={{
                        pageSize: 10,
                        position: ['bottomCenter']
                    }}
                >

                </Table>
            </div>
        </div>
    )
}
