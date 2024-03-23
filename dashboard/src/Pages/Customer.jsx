import React, { useContext, useEffect, useState } from 'react'
import Header from '../Components/Header'
import { FirebaseContext } from '../Context/FirebaseProvider';
import { onSnapshot, query } from 'firebase/firestore';
import { Link } from 'react-router-dom';
import { Button, Descriptions, Input, Space, Table } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import Highlighter from "react-highlight-words";
import { useRef } from 'react';

export default function Customer() {
    const [searchText, setSearchText] = useState('');
    const [ctmList, setCtmList] = useState([])
    const [uniqueCtm, setUniqueCtm] = useState([])
    const [searchedColumn, setSearchedColumn] = useState('');
    const searchInput = useRef(null);
    const { customer } = useContext(FirebaseContext)
    const [customers, setCustomers] = useState([])
    useEffect(() => {
        const q = query(customer);
        const unsubscribe = onSnapshot(q, (querySnapshot) => {
            const temp = [];
            querySnapshot.forEach((doc) => {
                temp.push({ ...doc.data(), id: doc.id });
            });
            setCustomers(temp)
        });
    }, [])
    const handleSearch = (selectedKeys, confirm, dataIndex) => {
        confirm();
        setSearchText(selectedKeys[0]);
        setSearchedColumn(dataIndex);
    };
    const handleReset = (clearFilters) => {
        clearFilters();
        setSearchText('');
    };
    const getColumnSearchProps = (dataIndex) => ({
        filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters, close }) => (
            <div
                style={{
                    padding: 8,
                }}
                onKeyDown={(e) => e.stopPropagation()}
            >
                <Input
                    ref={searchInput}
                    placeholder={`Search ${dataIndex}`}
                    value={selectedKeys[0]}
                    onChange={(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])}
                    onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
                    style={{
                        marginBottom: 8,
                        display: 'block',
                    }}
                />
                <Space>
                    <Button
                        type="primary"
                        onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
                        icon={<SearchOutlined />}
                        size="small"
                        style={{
                            width: 90,
                        }}
                    >
                        Search
                    </Button>
                    <Button
                        onClick={() => clearFilters && handleReset(clearFilters)}
                        size="small"
                        style={{
                            width: 90,
                        }}
                    >
                        Reset
                    </Button>
                    <Button
                        type="link"
                        size="small"
                        onClick={() => {
                            close();
                        }}
                    >
                        Close
                    </Button>
                </Space>
            </div>
        ),
        filterIcon: (filtered) => (
            <SearchOutlined
                style={{
                    color: filtered ? '#1677ff' : undefined,
                }}
            />
        ),
        onFilter: (value, record) =>
            record[dataIndex].toString().toLowerCase().includes(value.toLowerCase()),
        onFilterDropdownOpenChange: (visible) => {
            if (visible) {
                setTimeout(() => searchInput.current?.select(), 100);
            }
        },
        render: (text) =>
            searchedColumn === dataIndex ? (
                <Highlighter
                    highlightStyle={{
                        backgroundColor: '#ffc069',
                        padding: 0,
                    }}
                    searchWords={[searchText]}
                    autoEscape
                    textToHighlight={text ? text.toString() : ''}
                />
            ) : (
                text
            ),
    });

    useEffect(() => {
        let temp = []
        customers.forEach((item) => {
            temp.push(
                {
                    ctmName: `${item.costumer.firstname} ${item.costumer.lastname}`,
                    ctmMail: item.costumer.customer,
                    ctmOrder: [{
                        id: item.id,
                        date: item.costumer.date,
                        phone: item.costumer.phone,
                        note: item.costumer.note,
                        address: `${item.costumer.company}, ${item.costumer.towncity}, ${item.costumer.state}, ${item.costumer.country}, ${item.costumer.zip}`
                    }]
                }
            )
            temp.sort((a, b) => a.ctmMail.localeCompare(b.ctmMail))
            setCtmList(temp)
        })
    }, [customers])
    useEffect(() => {
        let temp = [...ctmList]
        for (let i = 0; i < temp.length; i++) {
            for (let j = 0; j != i && j < temp.length; j++) {
                if (temp[i].ctmMail == temp[j].ctmMail) {
                    temp[j].ctmOrder.forEach((item) => {
                        temp[i].ctmOrder.push(
                            {
                                id: item.id,
                                date: item.date,
                                phone: item.phone,
                                note: item.note,
                                address: item.address
                            }
                        )
                    })
                    temp.splice(j, 1)
                    setUniqueCtm(temp)
                }
            }
        }
    }, [ctmList])

    console.log(uniqueCtm);
    const columns = [

        {
            title: 'Customer Name',
            dataIndex: 'customerName',
            width: '20%',
            sorter: (a, b) => a.customerName.localeCompare(b.customerName),
            key: 'customerName',
            ...getColumnSearchProps('customerName'),
            render: (text, record) => <Link to={`/customer/detail/${record.key}`}>{text}</Link>,
        },
        {
            title: 'Email',
            dataIndex: 'mail',
            width: '20%',
            ...getColumnSearchProps('mail'),
            render: (text) => <a href={`mailto:${text}`}>{text}</a>,
        },
        {
            title: 'Phone',
            dataIndex: 'phone',
            width: '15%',
            ...getColumnSearchProps('phone'),
            render: (text) => <a href={`tel:${text}`}>{text}</a>,
        },
        {
            title: 'Address',
            dataIndex: 'address',
            width: '35%',
            ...getColumnSearchProps('address')
        }
    ]

    let dataTable = uniqueCtm.map((item) => {
        return {
            key: item.ctmMail,
            customerName: item.ctmName,
            mail: item.ctmMail,
            phone: item.ctmOrder[0].phone,
            address: item.ctmOrder[0].address,
            order: item.ctmOrder
        }
    })
    // console.log(dataTable);
    const breadcrumb = [
        {
            title: <Link to={'/dashboard'}>Dashboard</Link>
        },
        {
            title: <span style={{ color: 'var(--main)' }}>Customers</span>
        }
    ]
    return (
        <div>
            <Header title='Customers' breadcrumb={breadcrumb}></Header>
            <div className='body-content'>
                <Table
                    columns={columns}
                    dataSource={dataTable}
                    pagination={{
                        pageSize: 10,
                        position: ['bottomCenter']
                    }}
                >

                </Table>
            </div>
        </div>
    )
}
