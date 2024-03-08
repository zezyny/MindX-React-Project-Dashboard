import React from 'react'
import { Breadcrumb, Button, } from 'antd';
import { RiMessage3Fill } from "react-icons/ri";
import { IoNotifications } from "react-icons/io5";

export default function Header(props) {
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
                    <div className='header-user'>
                        <img src="/logo.svg" alt="" />
                        <div className="header-user-detail">
                            <h2>Name</h2>
                            <p>Admin</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
