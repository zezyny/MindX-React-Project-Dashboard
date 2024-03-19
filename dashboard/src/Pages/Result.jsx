import React from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { Button, Result } from 'antd';
export default function ResultPage() {
    const { state } = useLocation()
    const navigate = useNavigate()
    return (
        <div className='body-content'>
            <Result
                status={state.status}
                title={state.notify}
                subTitle={`Product name: ${state.nameItem}`}
                extra={[
                    <Button
                        style={{ width: '175px' }}
                        size='large'
                        type="primary"
                        key='dashboard'
                        onClick={() => { navigate('/dashboard') }}>
                        Back to dashboard
                    </Button>,
                    <Button
                        style={{ width: '175px' }}
                        size='large'
                        key='add'
                        onClick={() => { navigate(`${state.btnNav}`) }}>
                        {state.btn}
                    </Button>,
                ]}
            />
        </div>
    )
}
