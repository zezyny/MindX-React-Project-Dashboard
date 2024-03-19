import React, { useContext, useEffect, useState } from 'react'
import Header from '../Components/Header'
import { FirebaseContext } from '../Context/FirebaseProvider';
import { onSnapshot, query } from 'firebase/firestore';
import { Link } from 'react-router-dom';
import { Button, Input, Space, Table } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import Highlighter from "react-highlight-words";
import { useRef } from 'react';

export default function Customer() {
    const [searchText, setSearchText] = useState('');
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
                    {/* <Button
                        type="link"
                        size="small"
                        onClick={() => {
                            confirm({
                                closeDropdown: false,
                            });
                            setSearchText(selectedKeys[0]);
                            setSearchedColumn(dataIndex);
                        }}
                    >
                        Filter
                    </Button> */}
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
    const columns = [
        {
            title: 'ID',
            dataIndex: 'id',
            width: '10%',
            align: 'center',
            key: 'key',
            render: (text, record) => <Link to={`/customer/detail/${record.key}`}>{text.toUpperCase()}</Link>
        },
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

    let dataTable = customers.map((item) => {
        return {
            key: item.id,
            id: item.costumer.id,
            customerName: `${item.costumer.firstname} ${item.costumer.lastname}`,
            mail: item.costumer.customer,
            phone: item.costumer.phone,
            address: `${item.costumer.house}, ${item.costumer.towncity}, ${item.costumer.state}, ${item.costumer.country}, ${item.costumer.zip}`,
            // order: item.order
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
