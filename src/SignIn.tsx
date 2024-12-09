import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
const SignIn:React.FC = () => {
    const account = {
        email: 'studysyncadmin',
        password: 'studysyncadmin1525'
    }
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const nav = useNavigate()


    function signIn() {
        if (email === account.email && password === account.password) {
            nav('/dashboard')
        } else {
            alert('Incorrect email or password')
        }
    }


  return (
    <div className="flex justify-center items-center h-screen">
        <div className="w-full max-w-md p-5 shadow-lg rounded-lg">
            <h1 className="text-center text-black mb-5 text-2xl font-bold">Sign In</h1>
            <form>
                <div className="mb-4">
                    <label className="block text-gray-700">Username</label>
                    <input type="text" className="form-control w-full px-3 py-2 border-[#535353] rounded bg-[#fff] text-black border-[1px]" onChange={(e) => setEmail(e.target.value)} />
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700">Password</label>
                    <input type="password" className="form-control w-full px-3 py-2 border-[#535353] rounded bg-[#fff] text-black border-[1px]" onChange={(e) => setPassword(e.target.value)} />
                </div>
                <button type="button" className="btn btn-primary w-full mt-5 py-2 bg-blue-500 text-white rounded" onClick={signIn}>Sign In</button>
            </form>
        </div>
    </div>
  )
}

export default SignIn
