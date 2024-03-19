import React, { useContext, useEffect, useState } from 'react'
import { Button, ColorPicker, Form, Input, InputNumber, Select, Tag } from 'antd';
import { Link, useNavigate, useParams } from 'react-router-dom'
import { FirebaseContext } from '../Context/FirebaseProvider'
import { doc, getDoc, onSnapshot, query, updateDoc } from 'firebase/firestore'
import TextArea from 'antd/es/input/TextArea'
import Header from '../Components/Header'
export default function DetailProduct() {
    const param = useParams()
    const { messCollect } = useContext(FirebaseContext)
    const navigate = useNavigate()
    let singledoc = doc(messCollect, param.id)
    let [mess, setmess] = useState(null)
    useEffect(() => {
        let getmess = async () => {
            const data = await getDoc(singledoc)
            setmess(data.data())
        }
        getmess()
    }, [])

    const [imageUrl1, setImageUrl1] = useState('');
    const [imageUrl2, setImageUrl2] = useState('');
    const [imageUrl3, setImageUrl3] = useState('');
    // console.log(imageUrl1);
    // console.log(mess);
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

    // breadcrumb=====================
    const breadcrumb = [
        {
            title: <Link to={'/dashboard'}>Dashboard</Link>
        },
        {
            title: <Link to={'/products'}>Products</Link>
        },
        {
            title: <span style={{ color: 'var(--main)' }}>{mess?.productName}</span>
        }
    ]

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
    const [form] = Form.useForm()
    useEffect(() => {
        form.setFieldsValue({
            productName: mess?.productName,
            description: mess?.description,
            price: mess?.price,
            discount: mess?.discount,
            quantity: mess?.stock,
            categories: mess?.categories,
            color1: mess?.productColor[0].colorCode,
            color2: mess?.productColor[1].colorCode,
            color3: mess?.productColor[2].colorCode,
            var1: mess?.productColor[0].nameColor,
            var2: mess?.productColor[1].nameColor,
            var3: mess?.productColor[2].nameColor,
            // link1: mess?.img[0],
            // link2: mess?.img[1],
            // link3: mess?.img[2],
            id: param?.id,
        }
        )
        setImageUrl1(mess?.img[0])
        setImageUrl2(mess?.img[1])
        setImageUrl3(mess?.img[2])
    }, [mess])
    const updateItem = async (value) => {
        // console.log(imageUrl1);
        // console.log(mess)
        const newData = {
            productName: value.productName,
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
                    colorCode: typeof (value.color1) == 'string' ? value.color1 : `#${value.color1.toHex()}`,
                    nameColor: value.var1
                },
                {
                    colorCode: typeof (value.color2) == 'string' ? value.color2 : `#${value.color2.toHex()}`,
                    nameColor: value.var2
                },
                {
                    colorCode: typeof (value.color3) == 'string' ? value.color3 : `#${value.color3.toHex()}`,
                    nameColor: value.var3
                },
            ]
        };
        // Sử dụng hàm updateDoc để cập nhật dữ liệu
        await updateDoc(doc(messCollect, param.id), newData);
        navigate('/result', {
            state: {
                nameItem: `${value.productName}`,
                notify: 'The product has been updated!',
                status: 'success',
                btn: 'See all products',
                btnNav: '/products'
            }
        })
    }

    return (
        <div>
            <Header breadcrumb={breadcrumb} title={mess?.productName} />
            <div className="body-content">
                {/* {console.log(mess?.productColor[0].colorCode)} */}
                <Form
                    layout='horizontal'
                    form={form}
                    labelCol={{ span: '3' }}
                    wrapperCol={{ span: '18' }}
                    onFinish={updateItem}
                    initialValues={
                        {
                            color1: `${mess?.productColor[0].colorCode}`,
                            color2: `${mess?.productColor[1].colorCode}`,
                            color3: `${mess?.productColor[2].colorCode}`
                        }
                    }
                >
                    <Form.Item
                        label='Product name'
                        name='productName'
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
                            <Form.Item style={{ maxWidth: '200px' }}>
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
                            <Form.Item style={{ maxWidth: '200px' }}>
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
                            <Form.Item style={{ maxWidth: '200px' }}>
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
                            Update
                        </Button>
                    </Form.Item>
                </Form>
            </div>
        </div >
    )
}
