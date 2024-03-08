import React, { useContext, useEffect, useState } from 'react'
import Header from '../Components/Header'
import { MdDelete, MdModeEditOutline } from "react-icons/md";
import { FirebaseContext } from '../Context/FirebaseProvider'
import { onSnapshot, query } from 'firebase/firestore'
import { Table, Button, Image, Input, Popconfirm } from 'antd'
import { Link } from 'react-router-dom'
export default function Products() {
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

    // handle table================================
    const columns = [

        {
            title: 'Product',
            dataIndex: 'products',
            defaultSortOrder: 'descend',
            sorter: (a, b) => a.products.localeCompare(b.products),
            width: '30%',
            render: (text) => <Link to={'/products/detail/:id'}>{text}</Link>
        },
        {
            title: 'Category',
            dataIndex: 'category',
            width: '15%',
        },
        {
            title: 'Image',
            dataIndex: 'img',
            width: '20%',
            align: 'center'
        },
        {
            title: 'Stock',
            dataIndex: 'stock',
            defaultSortOrder: 'descend',
            sorter: (a, b) => a.stock - b.stock,
            width: '10%',
            align: 'center'
        },
        {
            title: 'Price',
            dataIndex: 'price',
            defaultSortOrder: 'descend',
            sorter: (a, b) => a.price - b.price,
            width: '10%',
            align: 'center'
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
            img: <div>
                <Image.PreviewGroup preview={{
                    onChange: (current, prev) => console.log(`current index: ${current}, prev index: ${prev}`),
                }} />
                <Image src={item.img[0]} width={'30%'} />
                <Image src={item.img[1]} width={'30%'} />
                <Image src={item.img[2]} width={'30%'} />
            </div>,
            category: `${item.categories}`,
            price: `$${item.price}`,
            discount: `${item.discount}%`,
            stock: `${item.stock}`,
            delete: <div>
                <Popconfirm
                    title="Delete the task"
                    description="Are you sure to delete this product?"
                    okText="Yes"
                    cancelText="No"
                >
                    <Button onClick={() => { handleDelete(item.id) }} danger style={{ fontSize: '16px' }}><MdDelete /></Button>
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
    const handleDelete = (id) => {
        let newProductList = product.filter((item) => {
            item.id != id
        })
        setProduct(newProductList)
    }

    // breadcrumb=====================
    const breadcrumb = [
        {
            title: <Link to={'/'}>Dashboard</Link>
        },
        {
            title: 'Products'
        }
    ]
    return (
        <div>
            <Header title='Products' breadcrumb={breadcrumb} />
            <div className="product-content" >
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
                    >
                        Add new product
                    </Button>
                </div>
                <Table
                    columns={columns}
                    dataSource={dataTable}
                    pagination={{
                        current: 1,
                        pageSize: 10,
                        position: ['bottomCenter']
                    }}
                />
            </div>
        </div>
    )
}
