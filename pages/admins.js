import Layout from "@/components/Layout";
import Spinner from "@/components/Spinner";
import { prettyDate } from "@/lib/date";
import axios from "axios";
import { useEffect, useState } from "react";
import { withSwal } from 'react-sweetalert2';

function AdminsPage({swal}) {
    const [email, setEmail] = useState('')
    const [adminEmails, setAdminsEmails] = useState([])
    const [isLoading, setIsLoading] = useState(false)

    const addAdmin = (e) => {
        e.preventDefault()
        axios.post('/api/admins', {email}).then(res => {
            console.log(res.data);
            swal.fire({
                title: 'Admin created !',
                icon: 'success',
            })
            setEmail('')
            loadAdmins()
        }).catch(err => {
            swal.fire({
                title: 'Error !',
                text: err.response.data.message,
                icon: 'error',
            })
        })
    }
    const loadAdmins = () => {
        setIsLoading(true)
        axios.get('/api/admins').then(res => {
            setAdminsEmails(res.data)
            setIsLoading(false)
        })
    }
    const deleteAdmin = (_id, email) => {
                swal.fire({
            title: 'Are you sure?',
            text: `Do you want to delete ${email}?`,
            showCancelButton: true,
            cancelButtonText: 'Cancel',
            confirmButtonText: 'Yes, Delete!',
            confirmButtonColor: '#d55',
            reverseButtons: true,
        }).then(async result => {
            if (result.isConfirmed) {
                axios.delete(`/api/admins?_id=${_id}`).then(() => {
                    swal.fire({
                        title: 'Admin deleted !',
                        icon: 'success',
                    })
                    loadAdmins()
                })                
            }
        })
    }
    useEffect(() => {
        loadAdmins()
    }, [])

    return (
        <Layout>
            <h1>Existing Admins</h1>
            <h2>Add new admin</h2>
            <form onSubmit={addAdmin}>
                <div className="flex gap-2">
                <input 
                    className="mb-0" 
                    type="text" 
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="google email"
                />
                <button className="btn-primary py-1 whitespace-nowrap" type="submit">Add admin</button>
                </div>
            </form>
            <h2>Existing admins</h2>
            <table className="basic">
                <thead>
                    <tr>
                        <th className="text-left">admin google email</th>
                    </tr>
                </thead>
            <tbody>
                {isLoading && (
                    <tr>
                        <td colSpan={2}>
                            <div className="py-4">
                                <Spinner fullWidth={true} />
                            </div>
                        </td>
                    </tr>
                )}
                {adminEmails.length > 0 && adminEmails.map(adminEmail => (
                    <tr key={adminEmail.email}>
                        <td>{adminEmail.email}</td>
                        <td>{adminEmail.createdAt && prettyDate(adminEmail.createdAt)}</td>
                        <td><button onClick={() => deleteAdmin(adminEmail._id, adminEmail.email)} className="btn-red">Delete</button></td>
                    </tr>
                ))}
            </tbody>
            </table>
        </Layout>
    )
}

export default withSwal(({swal}, ref) => (
    <AdminsPage  swal={swal} />
) )