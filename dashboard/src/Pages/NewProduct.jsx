import React, { useContext, useEffect, useState } from 'react'
import Header from '../Components/Header'
import { FirebaseContext } from '../Context/FirebaseProvider'
import { addDoc, onSnapshot, query } from 'firebase/firestore'
import { Link, useNavigate } from 'react-router-dom'
import { Button, ColorPicker, Form, Input, InputNumber, Select, Modal, Upload } from 'antd';
import TextArea from 'antd/es/input/TextArea'
import { PlusOutlined } from '@ant-design/icons';

export default function NewProduct() {
    const [imageUrl1, setImageUrl1] = useState('');
    const [imageUrl2, setImageUrl2] = useState('');
    const [imageUrl3, setImageUrl3] = useState('');
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


    //button upload
    const handleChange = async (e, setImageUrl) => {
        const file = e.target.files[0];

        const formData = new FormData();
        formData.append('image', file);

        try {
            const response = await fetch('https://api.imgbb.com/1/upload?key=540b52f6ae3b8f1a483ead4acfa31ef3', {
                method: 'POST',
                body: formData
            });

            if (response.ok) {
                const data = await response.json();
                setImageUrl(data.data.url);
            } else {
                console.error('Upload failed:', response.statusText);
            }
        } catch (error) {
            console.error('Upload failed:', error);
        }
    };

    // breadcrumb=====================
    const breadcrumb = [
        {
            title: <Link to={'/dashboard'}>Dashboard</Link>
        },
        {
            title: <Link to={'/products'}>Products</Link>
        },
        {
            title: <span style={{ color: 'var(--main)' }}>New products</span>
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
        // console.log(imageUrl1, imageUrl2, imageUrl3);
        // console.log(value);
        await addDoc(messCollect, {
            productName: value.name,
            description: value.description,
            price: value.price,
            discount: value.discount,
            stock: value.quantity,
            categories: value.categories,
            img: [
                imageUrl1,
                imageUrl2,
                imageUrl3
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
                        <div style={{ display: 'flex', justifyContent: 'space-between', gap: '10px' }}>
                            <Form.Item style={{ width: '200px' }}>
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
                                            message: 'Please upload image!'
                                        }
                                    ]}
                                >

                                    <div>
                                        <input type="file" onChange={() => { handleChange(event, setImageUrl1) }} />
                                        <br />
                                        {imageUrl1 && <img
                                            src={imageUrl1}
                                            alt="Uploaded Image"
                                            style={{ width: '200px', height: '200px', objectFit: 'cover', borderRadius: '10%', border: '1px solid #ccc' }}
                                        />}
                                    </div>

                                </Form.Item>
                            </Form.Item>
                            <Form.Item style={{ width: '200px' }}>
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
                                            message: 'Please upload image!'
                                        }
                                    ]}
                                >
                                    <div>
                                        <input type="file" onChange={() => { handleChange(event, setImageUrl2) }} />
                                        <br />
                                        {imageUrl2 && <img
                                            src={imageUrl2}
                                            alt="Uploaded Image"
                                            style={{ width: '200px', height: '200px', objectFit: 'cover', borderRadius: '10%', border: '1px solid #ccc' }}
                                        />}
                                    </div>
                                </Form.Item>
                            </Form.Item>
                            <Form.Item style={{ width: '200px' }}>
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
                                            message: 'Please upload image!'
                                        }
                                    ]}
                                >
                                    <div>
                                        <input type="file" onChange={() => { handleChange(event, setImageUrl3) }} />
                                        <br />
                                        {imageUrl3 && <img
                                            src={imageUrl3}
                                            alt="Uploaded Image"
                                            style={{ width: '200px', height: '200px', objectFit: 'cover', borderRadius: '10%', border: '1px solid #ccc' }}

                                        />}
                                    </div>
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
