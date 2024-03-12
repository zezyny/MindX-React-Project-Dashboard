import React, { useContext, useEffect, useState } from 'react'
import Header from '../Components/Header'
import { FirebaseContext } from '../Context/FirebaseProvider'
import { addDoc, onSnapshot, query } from 'firebase/firestore'
import { Link, useNavigate } from 'react-router-dom'
import { Button, ColorPicker, Form, Input, InputNumber, Select, Tag } from 'antd';
import TextArea from 'antd/es/input/TextArea'
export default function NewProduct() {
    let [product, setProduct] = useState([])
    const { messCollect } = useContext(FirebaseContext)
    const navigate = useNavigate()
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
    //category===========================
    const options = [
        {
            value: 'Decor',
            label: 'Decor'
        },
        {
            value: 'Bedroom',
            label: 'Bedroom'
        },
        {
            value: 'Office',
            label: 'Office'
        },
        {
            value: 'Living Room',
            label: 'Living Room'
        },
    ]

    // handle add product========================
    const addNewProduct = async (value) => {
        await addDoc(messCollect, {
            productName: value.name,
            description: value.description,
            price: value.price,
            discount: value.discount,
            stock: value.quantity,
            categories: value.categories,
            img: [
                value.link1,
                value.link2,
                value.link3
            ],
            productColor: [
                {
                    colorCode: `#${value.color1.toHex()}`,
                    nameColor: value.var1
                },
                {
                    colorCode: `#${value.color2.toHex()}`,
                    nameColor: value.var2
                },
                {
                    colorCode: `#${value.color3.toHex()}`,
                    nameColor: value.var3
                },
            ]
        })
        navigate(`/result`, {
            state: {
                nameItem: `${value.name}`,
                notify: 'New product was added successfully!',
                status: 'success',
                btn: 'Add another product',
                btnNav: '/products/new'
            }
        })
    }

    return (
        <div>
            <Header title='New products' breadcrumb={breadcrumb} />
            <div className="body-content">
                <Form
                    layout='horizontal'
                    labelCol={{ span: '3' }}
                    wrapperCol={{ span: '18' }}
                    onFinish={(value) => { addNewProduct(value); }}
                >
                    <Form.Item
                        label='Product name'
                        name='name'
                        rules={[
                            {
                                type: 'text',
                                message: 'The input is not valid name!',
                            },
                            {
                                required: true,
                                message: 'Please input product name!'
                            }
                        ]}>
                        <Input />
                    </Form.Item>
                    <Form.Item
                        label='Description'
                        name='description'
                    >
                        <TextArea
                            rows={10}
                        />
                    </Form.Item>
                    <Form.Item
                        label='Price'
                        name='price'
                        rules={[
                            {
                                type: 'number',
                                message: 'The input is not valid price!',
                            },
                            {
                                required: true,
                                message: 'Please input product price!'
                            }
                        ]}
                    >
                        <InputNumber
                            type='number'
                            style={{ width: '30%', marginRight: '10px' }}
                            placeholder='Price'
                        />

                    </Form.Item>
                    <Form.Item
                        label='Discount'
                        name='discount'
                    >
                        <InputNumber
                            type='number'
                            style={{ width: '30%', marginRight: '10px' }}
                            placeholder='Discount' />
                    </Form.Item>
                    <Form.Item
                        label='Quantity'
                        name='quantity'
                        rules={[
                            {
                                type: 'number',
                                message: 'The input is not valid quantity!',
                            },
                            {
                                required: true,
                                message: 'Please input product quantity!'
                            }
                        ]}
                    >
                        <InputNumber
                            style={{ width: '30%', marginRight: '10px' }}
                            placeholder='Quantity'
                        />
                    </Form.Item>
                    <Form.Item
                        label='Category'
                        name='categories'
                        rules={[
                            {
                                required: true,
                                message: 'Please choose categories!'
                            }
                        ]}
                    >
                        <Select
                            mode='tags'
                            allowClear
                            placeholder='Please select categories'
                            options={options}
                            tokenSeparators={[',']}
                        />
                    </Form.Item>
                    <Form.Item
                        label='Variation'
                    >
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <Form.Item style={{ maxWidth: '300px', display: 'flex', gap: '5px' }}>
                                <Form.Item
                                    name='color1'
                                    rules={[
                                        {
                                            required: true,
                                            message: 'Please choose variation color!'
                                        }
                                    ]}
                                >
                                    <ColorPicker />
                                </Form.Item>
                                <Form.Item
                                    name='var1'
                                    rules={[
                                        {
                                            required: true,
                                            message: 'Please input variation name!'
                                        }
                                    ]}
                                >
                                    <Input placeholder='Name Variation 1' />
                                </Form.Item>
                                <Form.Item
                                    name='link1'
                                    rules={[
                                        {
                                            required: true,
                                            message: 'Please input image link!'
                                        }
                                    ]}
                                >
                                    <Input placeholder='Image Link' />
                                </Form.Item>
                            </Form.Item>
                            <Form.Item style={{ maxWidth: '300px' }}>
                                <Form.Item
                                    name='color2'
                                    rules={[
                                        {
                                            required: true,
                                            message: 'Please choose variation color!'
                                        }
                                    ]}
                                >
                                    <ColorPicker />
                                </Form.Item>
                                <Form.Item
                                    name='var2'
                                    rules={[
                                        {
                                            required: true,
                                            message: 'Please input variation name!'
                                        }
                                    ]}
                                >
                                    <Input placeholder='Name Variation 2' />
                                </Form.Item>
                                <Form.Item
                                    name='link2'
                                    rules={[
                                        {
                                            required: true,
                                            message: 'Please input image link!'
                                        }
                                    ]}
                                >
                                    <Input placeholder='Image Link' />
                                </Form.Item>
                            </Form.Item>
                            <Form.Item style={{ maxWidth: '300px' }}>
                                <Form.Item
                                    name='color3'
                                    rules={[
                                        {
                                            required: true,
                                            message: 'Please choose variation color!'
                                        }
                                    ]}
                                >
                                    <ColorPicker />
                                </Form.Item>
                                <Form.Item
                                    name='var3'
                                    rules={[
                                        {
                                            required: true,
                                            message: 'Please input variation name!'
                                        }
                                    ]}
                                >
                                    <Input placeholder='Name Variation 3' />
                                </Form.Item>
                                <Form.Item
                                    name='link3'
                                    rules={[
                                        {
                                            required: true,
                                            message: 'Please input image link!'
                                        }
                                    ]}
                                >
                                    <Input placeholder='Image Link' />
                                </Form.Item>
                            </Form.Item>
                        </div>
                    </Form.Item>
                    <Form.Item
                        wrapperCol={{
                            offset: 3
                        }}>
                        <Button type="primary" htmlType="submit" >
                            Submit
                        </Button>
                    </Form.Item>
                </Form>
            </div>
        </div>
    )
}
