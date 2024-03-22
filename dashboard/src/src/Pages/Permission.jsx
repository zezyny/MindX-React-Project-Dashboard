import React, { useContext, useEffect, useState } from 'react'
import { FirebaseContext } from '../Context/FirebaseProvider'
import { addDoc, deleteDoc, doc, onSnapshot, query, updateDoc } from 'firebase/firestore'
import { Link } from 'react-router-dom'
import Header from '../Components/Header'
import { Button, Form, Input, Modal, Popconfirm, Select, Table } from 'antd'
import { MdDelete } from "react-icons/md";

export default function Permission() {
    let user = JSON.parse(localStorage.getItem("user"))
    const [isModalOpen, setIsModalOpen] = useState(false);
    // console.log(user.role)
    let [multiMess, setMultiMess] = useState([])
    const { adminAccount } = useContext(FirebaseContext)
    useEffect(() => {
        const q = query(adminAccount);
        const unsubscribe = onSnapshot(q, (querySnapshot) => {
            const temp = [];
            querySnapshot.forEach((doc) => {
                temp.push({ ...doc.data(), id: doc.id });
            });
            temp.sort((a, b) => a.username.localeCompare(b.username));
            // console.log(temp)
            setMultiMess(temp)
        });
    }, [])
    const handleChange = async (value, record) => {
        console.log(record);
        const userChange = {
            username: record.username,
            password: record.pass,
            role: value,
            gmail: record.mail,
            phone: record.phone,
        }
        await updateDoc(doc(adminAccount, record.key), userChange);
    }
    const columns = [
        {
            title: 'UID',
            dataIndex: 'key',
            render: (text) => <p>{text.toUpperCase()}</p>
        },
        {
            title: 'Username',
            dataIndex: 'username',

        },
        {
            title: 'Email',
            dataIndex: 'mail',
            render: (text) => <a href={`mailto:${text}`}>{text}</a>
        },
        {
            title: 'Phone Number',
            dataIndex: 'phone',
            render: (text) => <a href={`tel:${text}`}>{text}</a>
        },
        {
            title: 'Role',
            dataIndex: 'role',
            width: '250px',
            render: (text, record) => <Select
                style={{ width: '200px' }}
                defaultValue={text}
                onChange={(value) => handleChange(value, record)}
                options={[
                    {
                        value: 'Administrator',
                        label: 'Administrator'
                    },
                    {
                        value: 'Sale Manager',
                        label: 'Sale Manager'
                    },
                    {
                        value: 'Community Manager',
                        label: 'Community Manager'
                    }
                ]}
            />
        },
        {
            title: 'Option',
            dataIndex: 'option',
            align: 'center'
        }
    ]

    const handleDelete = async (id) => {
        await deleteDoc(doc(adminAccount, id));
    }

    let dataTable = multiMess.map((item) => {
        return {
            key: item.id,
            username: item.username,
            pass: item.password,
            mail: item.gmail,
            phone: item.phone,
            role: item.role,
            option: item.username == 'admin' ? <></> : <div>
                <Popconfirm
                    title="Delete user"
                    description="Are you sure to delete?"
                    okText="Yes"
                    cancelText="No"
                    onConfirm={() => { handleDelete(item.id) }}
                >
                    <Button danger style={{ fontSize: '16px' }}><MdDelete /></Button>
                </Popconfirm>
            </div>
        }
    })

    const showModal = () => {
        setIsModalOpen(true);
    };
    const handleCancel = () => {
        setIsModalOpen(false);
    };
    const [form] = Form.useForm()
    const handleSubmit = async (value) => {
        // console.log(value);
        await addDoc(adminAccount, {
            username: value.username,
            password: value.password,
            gmail: value.gmail,
            phone: value.phone,
            role: value.role
        })
        setIsModalOpen(false)
        form.resetFields()
    }
    const breadcrumb = [
        {
            title: <Link to={'/dashboard'}>Dashboard</Link>
        },
        {
            title: <span style={{ color: 'var(--main)' }}>Permission</span>
        }
    ]
    return (
        <div>
            <Header title='Permission' breadcrumb={breadcrumb} />
            <div className='body-content'>
                {user.role == 'Administrator' ?
                    <div>
                        <Button
                            type='primary'
                            style={{ marginBottom: '20px' }}
                            onClick={showModal}
                        >
                            Add new user
                        </Button>
                        <Modal
                            title='Add new user'
                            open={isModalOpen}
                            onCancel={handleCancel}
                            footer=''
                        >
                            <Form
                                form={form}
                                layout='horizontal'
                                labelCol={{ span: '5' }}
                                wrapperCol={{ span: '18' }}
                                onFinish={(value) => handleSubmit(value)}
                            >
                                <Form.Item
                                    label='Username'
                                    name='username'
                                    rules={[
                                        {
                                            type: 'text',
                                            message: 'The input is not valid name!'
                                        },
                                        {
                                            required: 'true',
                                            message: 'Username is required!'
                                        }
                                    ]}
                                >
                                    <Input />
                                </Form.Item>
                                <Form.Item
                                    label='Password'
                                    name='password'
                                    rules={[
                                        {
                                            required: 'true',
                                            message: 'Password is required!'
                                        }
                                    ]}
                                >
                                    <Input.Password />
                                </Form.Item>
                                <Form.Item
                                    label='Email'
                                    name='gmail'
                                    rules={[
                                        {
                                            type: 'text',
                                            message: 'The input is not valid name!'
                                        },
                                        {
                                            required: 'true',
                                            message: 'Email is required!'
                                        }
                                    ]}
                                >
                                    <Input />
                                </Form.Item>
                                <Form.Item
                                    label='Phone'
                                    name='phone'
                                    rules={[
                                        {
                                            type: 'text',
                                            message: 'The input is not valid name!'
                                        },
                                        {
                                            required: 'true',
                                            message: 'Phone number is required!'
                                        }
                                    ]}
                                >
                                    <Input />
                                </Form.Item>
                                <Form.Item
                                    label='Role'
                                    name='role'
                                    rules={[
                                        {
                                            type: 'text',
                                            message: 'The input is not valid name!'
                                        },
                                        {
                                            required: 'true',
                                            message: 'Role is required!'
                                        }
                                    ]}
                                >
                                    <Select
                                        options={[
                                            {
                                                value: 'Administrator',
                                                label: 'Administrator'
                                            },
                                            {
                                                value: 'Sale Manager',
                                                label: 'Sale Manager'
                                            },
                                            {
                                                value: 'Community Manager',
                                                label: 'Community Manager'
                                            }
                                        ]}
                                    >

                                    </Select>
                                </Form.Item>
                                <Form.Item
                                    wrapperCol={{ offset: 15 }}
                                >
                                    <Button style={{ marginRight: '7px' }} onClick={handleCancel}>Cancel</Button>
                                    <Button style={{ marginRight: '7px' }} htmlType='submit' type='primary'>Submit</Button>
                                </Form.Item>
                            </Form>
                        </Modal>
                        <Table
                            dataSource={dataTable}
                            columns={columns}
                            pagination={{
                                position: ['none']
                            }}
                        >

                        </Table>
                    </div> : <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
                        <img style={{ width: '500px' }} src="https://static.vecteezy.com/system/resources/thumbnails/027/147/976/small_2x/access-denied-transparent-red-rubber-stamp-free-png.png" alt="" />
                        <h2 style={{ color: 'red' }}>You do not have permission to access!</h2>
                    </div>}
            </div>
        </div>
    )
}
