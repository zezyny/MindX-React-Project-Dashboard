import React, { useContext, useEffect, useState } from 'react'
import { Breadcrumb, Button, Popover } from 'antd';
import { RiMessage3Fill } from "react-icons/ri";
import { IoNotifications } from "react-icons/io5";
import { FirebaseContext } from '../Context/FirebaseProvider';
import { doc } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';

export default function Header(props) {
    const [user, setUser] = useState({})
    // const { adminAccount } = useContext(FirebaseContext)
    useEffect(() => {
        let storedUser = JSON.parse(localStorage.getItem('user'))
        if (storedUser) {
            setUser(storedUser)
        } else {
            navigate('/')
        }
    }, [])
    // console.log(user);
    // let singledoc = doc(adminAccount, uid)
    // let [user, setUser] = useState(null)
    // useEffect(() => {
    //     let getmess = async () => {
    //         const data = await getDoc(singledoc)
    //         setUser(data.data())
    //     }
    //     getmess()
    // }, [])
    const navigate = useNavigate()
    const logoutBtn = () => {
        localStorage.removeItem("user")
        navigate('/')
    }
    return (
        <div className='header'>
            <div className="header-content">
                <div className="page-title">
                    <h1>{props.title}</h1>
                    <Breadcrumb
                        items={props.breadcrumb}
                    />
                </div>
                <div className="header-menu">
                    <Button shape='circle' size='large'><RiMessage3Fill /></Button>
                    <Button shape='circle' size='large'><IoNotifications /></Button>
                    <Popover
                        content={
                            <div>
                                <Button onClick={logoutBtn}>Log out</Button>
                            </div>
                        }
                        className='header-user'
                    >
                        <img src="/logo.svg" alt="" />
                        <div className="header-user-detail">
                            <h2>{user.gmail}</h2>
                            <p>{user.role}</p>
                        </div>
                    </Popover>
                </div>
            </div>
        </div>
    )
}
