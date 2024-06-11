import type { NextPage } from 'next'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { FormEvent, useContext, useEffect, useState } from 'react'
import { toast } from 'react-toastify'
import Button from '../components/Button'
import { AppContext } from '../context/AppContext'
import axiosClient from '../utils/axiosClient'
import BASE_URL from '../utils/BaseURL'

interface SignUpInterface {
  name: String
  email: String
  password: String
}

const SignUp: NextPage = () => {
  const { user, loading} = useContext(AppContext)
  const [formData, setFormData] = useState<SignUpInterface>({ name: "", email: "", password: "" })
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

  const signup = async (e: FormEvent) => {
    e.preventDefault()

    if (formData.name.trim() == "" || formData.email.trim() == "" || formData.password.trim() == "") {
      toast.error("Please form all the fields")
      return
    }
    if (formData.password.length < 10) {
      toast.error("Password should have 10 or more characters")
      return
    }
    
    try {
      loading.set(true)
      const { data } = await axiosClient.post(BASE_URL + "/user/register", { ...formData })
      
      if (data.success) {
        toast.success(data.message)
        user.set(data.user)
        loading.set(false)
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
    <form className="flex flex-col  min-h-[90vh] items-center justify-center xm-3" onSubmit={signup}>
        <h1 className="text-6xl font-bold uppercase mb-5">Signup</h1>

        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Name
          </label>
          <input name="name" onChange={handleChange} className="shadow-md shadow-[#00000040] appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" type="text" placeholder="Enter your name..." />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Email
          </label>
          <input name="email" onChange={handleChange} className="shadow-md shadow-[#00000040] appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" type="email" placeholder="Enter your email..." />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Password (Min.10 characters)
          </label>
          <input name="password" onChange={handleChange} className="shadow-md shadow-[#00000040] appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" type="password" placeholder="Enter your password..." />
        </div>

        <div className="my-4">
          <Button color="info" type="submit" className="px-5 py-2 w-full shadow text-slate-100">Signup</Button>
        </div>

        <p>Already have an account ?</p>
        <Link href="/login">
            <span className="text-blue-500 underline cursor-pointer">
                Login Here
            </span>
        </Link>

    </form>
  )
}

export default SignUp
