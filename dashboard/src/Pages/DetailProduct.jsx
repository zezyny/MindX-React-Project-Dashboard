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
            title: <Link to={'/'}>Dashboard</Link>
        },
        {
            title: <Link to={'/products'}>Products</Link>
        },
        {
            title: <span>{mess?.productName}</span>
        }
    ]
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
            link1: mess?.img[0],
            link2: mess?.img[1],
            link3: mess?.img[2],
            id: param?.id,
        }
        )
    }, [mess])
    const updateItem = async (value) => {
        console.log(typeof (value.color1))
        // Dữ liệu mới bạn muốn cập nhật
        const newData = {
            productName: value.productName,
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
                            Update
                        </Button>
                    </Form.Item>
                </Form>
            </div>
        </div >
    )
}
