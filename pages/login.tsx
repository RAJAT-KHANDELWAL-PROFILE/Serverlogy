import type { NextPage } from 'next'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useContext, useEffect } from 'react'
import { FormEvent, useState } from 'react'
import { toast } from 'react-toastify'
import Button from '../components/Button'
import { AppContext } from '../context/AppContext'
import axiosClient from '../utils/axiosClient'
import BASE_URL from '../utils/BaseURL'

interface LoginFormData {
  email: string
  password: string
}

const Login: NextPage = () => {
  const [formData, setFormData] = useState<LoginFormData>({ email: "", password: "" })
  const { loading, user } = useContext(AppContext)
  const router = useRouter()

  useEffect(() => {
    if (user.value) {
      router.push("/dashboard")
    }
  }, [user.value])

  const handleChange = (e: FormEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.currentTarget.name]: e.currentTarget.value
    })
  }

  const login = async (e: FormEvent) => {
    e.preventDefault()

    if (formData.email.trim() == "" || formData.password.trim() == "") {
      toast.error("Please form all the fields")
      return
    }

    if (formData.password.trim().length < 10) {
      toast.error("Password should contain atleast 10 letters")
      return
    }
    
    try {
      loading.set(true)
      const { data } = await axiosClient.post(BASE_URL + "/user/login", { ...formData })
  
      if (data.success) {
        toast.success(data.message)
        loading.set(false)
        user.set(data.user)
        return
      }
      loading.set(false)
      toast.error(data.message)
    }
    catch (e: any) {
      loading.set(false)
      toast.error(e.response.data.message);
    }
  }


  return (
    <form className="flex flex-col min-h-[90vh] items-center justify-center mx-3" onSubmit={login}>
        <h1 className="text-6xl font-bold uppercase mb-5">Login</h1>

        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Email
          </label>
          <input name="email" onChange={handleChange} className="shadow-md shadow-[#00000040] appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" type="email" placeholder="Enter your email..." />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Password
          </label>
          <input name="password" onChange={handleChange} className="shadow-md shadow-[#00000040] appearance-none border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" type="password" placeholder="Enter your password..." />
          <Link href="/change_password">
            <a className="block text-blue-700 underline text-sm font-medium mt-2">Forgot password ?</a>
          </Link>
        </div>

        <div className="my-4">
          <Button type="submit" color="info" className="px-5 py-2 w-full shadow text-slate-100">Login</Button>
        </div>

        <p>{"Don't have an account ?"}</p>
        <Link href="/signup">
            <span className="text-blue-500 underline cursor-pointer">
                Create One
            </span>
        </Link>
    </form>
  )
}

export default Login
