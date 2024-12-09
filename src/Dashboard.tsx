import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { io, Socket } from 'socket.io-client'


const Dashboard: React.FC = () => {
    const [accounts, setAccounts] = useState<any[]>([])
    const [searchValue, setSearchValue] = useState<string>('')
    const [filteredAccounts, setFilteredAccounts] = useState<any[]>([])

    const [contacts, setContacts] = useState<any[]>([])
    const [report, setReport] = useState<any[]>([])

    useEffect(() => {
        const socket: Socket = io('https://studysyncserver-production.up.railway.app');

        // Fetch all accounts
        axios
            .get('https://studysyncserver-production.up.railway.app/getAllAccounts')
            .then((res) => {
                setAccounts(res.data);
                setFilteredAccounts(res.data);
            })
            .catch((err) => {
                console.error(err);
            });

        // Listen for updates via Socket.IO
        socket.on('updateAccount', (updatedAccount: any) => {
            console.log('Received updateAccount event:', updatedAccount);
            setAccounts((prevAccounts) =>
                prevAccounts.map((account) =>
                    account._id === updatedAccount._id
                        ? { ...account, isBanned: updatedAccount.isBanned }
                        : account
                )
            );
        });

        return () => {
            socket.disconnect();
        };
    }, []);


    useEffect(() => {
        axios
            .get('https://studysyncserver-production.up.railway.app/getContacts')
            .then((res) => {
                setContacts(res.data);
            })
            .catch((err) => {
                console.error(err);
            });
    }, [])

    useEffect(() => {
        axios
            .get('https://studysyncserver-production.up.railway.app/getReports')
            .then((res) => {
                setReport(res.data);
                console.log(res.data);
            })
            .catch((err) => {
                console.error(err);
            });
    }, [])



    const handleBan = (id: string) => {
        console.log(`Attempting to ban account with Uid: ${id}`); // Debugging
        axios
            .post('https://studysyncserver-production.up.railway.app/banUser', { Uid: id })
            .then(res => {
                setAccounts(accounts.map((account: any) => {
                    if (account.Uid === id) {
                        account.isBanned = true;
                    }
                    return account;
                }));
            })
            .catch(err => {
                console.error('Error banning account:', err.response?.data || err.message);
            });
    };




    const handleRecover = (id: string) => {
        // Implement recover functionality
        console.log(`Recover account with id: ${id}`);

        axios
            .post('https://studysyncserver-production.up.railway.app/recoverUser', { Uid: id })
            .then(res => {
                setAccounts(accounts.map((account: any) => {
                    if (account.Uid === id) {
                        account.isBanned = false;
                    }
                    return account;
                }));
            })
            .catch(err => {
                console.error('Error recovering account:', err.response?.data || err.message);
            });
    };


    useEffect(() => {
        setFilteredAccounts(accounts.filter((account) => {
            return account.Email.toLowerCase().includes(searchValue.toLowerCase()) ||
                   account.Username.toLowerCase().includes(searchValue.toLowerCase()) ||
                   account.Uid.toLowerCase().includes(searchValue.toLowerCase());
        }));
    }, [searchValue, accounts]);

    return (
        <div className='text-black w-full'>
            <div>
                <div>Accounts</div>
                <input
                    onChange={(e) => setSearchValue(e.target.value)}
                    value={searchValue}
                    className='p-3 bg-[#fff] border-[1px] border-[#535353] w-full mb-4'
                    type="text" placeholder='Search user...' />
            </div>
            <div className='max-h-[400px] min-h-[400px] overflow-auto'>
            <table className='bg-[#888] w-full text-white p-3 h-full'>
                <thead className='bg-[#999]'>
                    <tr>
                        <th className='p-3'>Email</th>
                        <th>User ID</th>

                        <th>Username</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    {filteredAccounts.map((account: any) => (
                        <tr key={account._id}>
                            <td className='p-3'>{account.Email}</td>
                            <td>{account.Uid}</td>
                            <td>{account.Username}</td>

                            <td className='flex flex-col gap-3'>
                                {
                                    account.isBanned ? (
                                        <button onClick={() => handleRecover(account.Uid)} className='bg-green-500 p-1 rounded'>Recover</button>
                                    ) : (
                                        <button onClick={() => handleBan(account.Uid)} className='bg-red-500 p-1 rounded'>Ban</button>
                                    )
                                }
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            </div>


            <div>
                <div>Inquiries</div>
                <table className='bg-[#888] w-full text-white p-3'>
                    <thead className='bg-[#999]'>
                        <tr>
                            <th className='p-3'>Firstname</th>
                            <th>Lastname</th>
                            <th>Email</th>
                            <th>Interests</th>
                            <th>Message</th>
                            <th>
                                Action
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {contacts.map((contact: any) => (
                            <tr key={contact._id}>
                                <td className='p-3'>{contact.Firstname}</td>
                                <td>{contact.Lastname}</td>
                                <td>{contact.Email}</td>
                                <td>{contact.Interests}</td>
                                <td>{contact.Message.trim()}</td>
                                <td>
                                    <button
                                        onClick={() => {
                                            const email = contact.Email;
                                            const subject = encodeURIComponent(contact.Interests);
                                            window.location.href = `mailto:${email}?subject=${subject}`;
                                        }}
                                        className='bg-blue-500 p-1 rounded mt-4'
                                    >
                                        Contact User
                                    </button>


                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

            </div>

            <div>
                <div>Reports</div>
                <table className='bg-[#888] w-full text-white p-3'>
                    <thead className='bg-[#999]'>
                        <tr>
                            <th className='p-3'>Date</th>
                            <th>Message</th>
                            <th>Type</th>
                            <th>Reported By</th>
                            <th>Reported User</th>
                        </tr>
                    </thead>
                    <tbody>
                        {report.map((rep: any) => (
                            <tr key={rep._id}>
                                <td className='p-3'>{new Date(parseInt(rep.Date)).toLocaleString()}</td>
                                <td>{rep.Message}</td>
                                <td>{rep.Type}</td>
                                <td>{rep.Uid}</td>
                                <td>{rep.UidToReport}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>

            </div>

        </div>
    )
}

export default Dashboard
