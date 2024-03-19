import React, { useContext, useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { FirebaseContext } from '../Context/FirebaseProvider'
import { doc, getDoc } from 'firebase/firestore'
import Header from '../Components/Header'
import { Descriptions, Table } from 'antd'

export default function DetailCustomer() {
    const { id } = useParams()
    const { customer } = useContext(FirebaseContext)
    let singledoc = doc(customer, id)
    let [ctm, setCtm] = useState(null)
    useEffect(() => {
        let getmess = async () => {
            const data = await getDoc(singledoc)
            setCtm(data.data())
        }
        getmess()
    }, [])
    const items = [
        {
            key: '1',
            label: 'Customer Name',
            children: `${ctm?.costumer.firstname} ${ctm?.costumer.lastname}`
        },
        {
            key: '2',
            label: 'Registration Date',
            children: ctm?.costumer.date
        },
        {
            key: '3',
            label: 'ID',
            children: `${ctm?.costumer.id.toUpperCase()}`
        },
        {
            key: '4',
            label: 'Email',
            children: <a href={`mailto:${ctm?.costumer.customer}`}>{ctm?.costumer.customer}</a>
        },
        {
            key: '5',
            label: 'Phone',
            children: <a href={`tel:${ctm?.costumer.phone}`}>{ctm?.costumer.phone}</a>
        },
        {
            key: '6',
            label: 'Note',
            children: ctm?.costumer.note
        },
        {
            key: '7',
            label: 'Address',
            children: `${ctm?.costumer.house}, ${ctm?.costumer.towncity}, ${ctm?.costumer.state}, ${ctm?.costumer.country}, ZIP Code: ${ctm?.costumer.zip}`
        },
    ]
    const renderCtmInfo = () => {
        return <Descriptions
            title='Customer Info'
            items={items}
            style={{
                backgroundColor: 'var(--background1)',
                padding: '30px',
                borderRadius: '20px'
            }}
        />
    }
    const renderCtmCart = () => {
        return <div
            style={{
                backgroundColor: 'var(--background1)',
                padding: '30px',
                borderRadius: '20px',
                marginTop: '20px'
            }}>
            <h4 style={{ marginBottom: '30px' }}>{`${ctm?.costumer.firstname}'s Cart`}</h4>
            <Table></Table>
        </div>
    }

    const breadcrumb = [
        {
            title: <Link to={'/dashboard'}>Dashboard</Link>
        },
        {
            title: <Link to={'/customer'}>Customers</Link>
        },
        {
            title: <span style={{ color: 'var(--main)' }}>{`${ctm?.costumer?.firstname} ${ctm?.costumer?.lastname}`}</span>
        }
    ]
    return (
        <div>
            <Header title={`${ctm?.costumer?.firstname} ${ctm?.costumer?.lastname}`} breadcrumb={breadcrumb} />
            <div className='body-content'>
                {renderCtmInfo()}
                {renderCtmCart()}
            </div>
        </div>
    )
}
