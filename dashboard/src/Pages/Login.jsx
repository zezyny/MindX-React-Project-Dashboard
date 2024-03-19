import { Button, Form, Input } from 'antd';
import Checkbox from 'antd/es/checkbox/Checkbox';
import React, { useContext, useEffect, useState } from 'react'
import { FirebaseContext } from '../Context/FirebaseProvider';
import { onSnapshot, query } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function Login() {
    const [admin, setAdmin] = useState([])
    const [user, setUser] = useState({})
    const { adminAccount } = useContext(FirebaseContext)
    const navigate = useNavigate()
    useEffect(() => {
        const q = query(adminAccount);
        const unsubscribe = onSnapshot(q, (querySnapshot) => {
            const temp = [];
            querySnapshot.forEach((doc) => {
                temp.push({ ...doc.data(), id: doc.id });
            });
            setAdmin(temp)
        });
    }, [])

    useEffect(() => {
        let storedUser = JSON.parse(localStorage.getItem('user'))
        if (storedUser) {
            setUser(storedUser)
            navigate('/dashboard')
        }
    }, [])
    // useEffect(() => {
    //     localStorage.setItem('uid', JSON.stringify(uid))
    // }, [uid])
    // console.log(admin)
    const onFinish = (values) => {
        for (let i = 0; i < admin.length; i++) {
            if (admin[i]?.username == values.username) {
                if (admin[i]?.password == values.password) {
                    navigate('/dashboard')
                    setUser(admin[i])
                    localStorage.setItem('user', JSON.stringify(admin[i]))
                }
                return
            }
            toast.error("Username or password is incorrect!", {
                toastId: 'custom-id-yes'
            })
        }
    };

    // console.log(JSON.stringify(user));
    return (
        <div className={JSON.stringify(user) == '{}' ? 'login-content' : 'login-hide'}>
            <Form
                name="basic"
                labelCol={{
                    span: 4,
                }}
                wrapperCol={{
                    span: 16,
                }}
                style={{
                    width: 600,
                    margin: 'auto',
                    boxShadow: 'rgba(99, 99, 99, 0.2) 0px 2px 8px 0px',
                    padding: '50px 0px 20px 80px',
                    borderRadius: '10px',
                    backgroundColor: 'var(--background1)',
                }}
                initialValues={{
                    remember: true,
                }}
                onFinish={onFinish}
                autoComplete="off"
            >
                <Form.Item
                    label="Username"
                    name="username"
                    rules={[
                        {
                            required: true,
                            message: 'Please input your username!',
                        },
                    ]}
                >
                    <Input />
                </Form.Item>

                <Form.Item
                    label="Password"
                    name="password"
                    rules={[
                        {
                            required: true,
                            message: 'Please input your password!',
                        },
                    ]}
                >
                    <Input.Password />
                </Form.Item>

                <Form.Item
                    name="remember"
                    valuePropName="checked"
                    wrapperCol={{
                        offset: 4,
                        span: 16,
                    }}
                >
                    <Checkbox>Remember me</Checkbox>
                </Form.Item>

                <Form.Item
                    wrapperCol={{
                        offset: 4,
                        span: 16,
                    }}
                >
                    <Button type="primary" htmlType="submit">
                        Submit
                    </Button>
                </Form.Item>
            </Form>
            <ToastContainer />
        </div >
    )
}
