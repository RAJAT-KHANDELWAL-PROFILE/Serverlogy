import type { NextPage } from "next";
import { useRouter } from "next/router";
import { FormEvent, useContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import Button from "../components/Button";
import { AppContext } from "../context/AppContext";
import modalStyles from "../styles/Modal.module.css";
import axiosClient from "../utils/axiosClient";
import BASE_URL from "../utils/BaseURL";
import { FaArrowLeft } from "react-icons/fa";

interface PwForm {
  password: string;
  confirmPassword: string;
}

const ChangePassword: NextPage = () => {
  const { user, loading } = useContext(AppContext);
  const router = useRouter();
  const [emailSent, setEmailSent] = useState<Boolean>(false);
  const [passwordForm, setPasswordForm] = useState<Boolean>(false);
  const [email, setEmail] = useState<string>("");
  const [token, setToken] = useState<string>("");

  const [pwFormData, setPwformData] = useState<PwForm>({
    password: "",
    confirmPassword: "",
  });

  useEffect(() => {
    if (!token) {
      const t_ = router.query.token;

      if (t_) {
        setPasswordForm(true);
        setToken(t_ as string);
      }
    }
  });

  const handleChange = (e: FormEvent<HTMLInputElement>) => {
    setPwformData({
      ...pwFormData,
      [e.currentTarget.name]: e.currentTarget.value,
    });
  };

  const changeEmail = (e: FormEvent<HTMLInputElement>) => {
    setEmail(e.currentTarget.value);
  };

  const getPwChangeEmail = async (email: string) => {
    setEmail(email);
    try {
      loading.set(true);
      const { data } = await axiosClient.get(
        BASE_URL + "/user/reset_password",
        { params: { email } }
      );
      if (data.success) {
        setEmailSent(true);
        toast.success(data.message);
        loading.set(false);
      } else {
        toast.error(data.message);
        loading.set(false);
      }
    } catch (e: any) {
      if (e.response.data.message) {
        toast.error(e.response.data.message);
      }
      loading.set(false);
    }
  };

  const changePw = async (e: FormEvent) => {
    e.preventDefault();
    console.log(pwFormData);

    if (
      pwFormData.password.trim() == "" ||
      pwFormData.confirmPassword.trim() == ""
    ) {
      toast.error("Please enter both passwords");
      return;
    }

    if (pwFormData.password.length < 10) {
      toast.error("Password should have 10 or more characters");
      return;
    }

    if (pwFormData.password !== pwFormData.confirmPassword) {
      toast.error("Passwords don't match");
      return;
    }

    try {
      loading.set(true);
      const { data } = await axiosClient.post(
        BASE_URL + "/user/reset_password",
        { token, password: pwFormData.password }
      );

      loading.set(false);
      if (data.success) {
        toast.success("Password changed successfully");
        router.push("/login");
      } else {
        toast.error(data.message);
      }
    } catch (e: any) {
      if (e.response.data.message) {
        toast.error(e.response.data.message);
      }
      loading.set(false);
    }
  };

  if (passwordForm) {
    return (
      <div className={modalStyles.modal}>
        <div className={modalStyles.modalContent}>
          <h1 className="text-4xl text-blue-600 font-bold capitalize text-center mb-8 mt-3">
            Change Password
          </h1>

          <form onSubmit={changePw}>
            <div>
              <input
                name="password"
                onChange={handleChange}
                className="shadow-md mb-5 shadow-[#00000040] appearance-none border rounded w-full p-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                type="password"
                placeholder="Enter your new password..."
              />
            </div>

            <div>
              <input
                name="confirmPassword"
                onChange={handleChange}
                className="shadow-md mb-5 shadow-[#00000040] appearance-none border rounded p-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                type="password"
                placeholder="Confirm your password..."
              />
            </div>

            <Button
              type="submit"
              color="info"
              className="p-3 w-full shadow mt-2 mb-5 text-slate-100"
            >
              Reset Password
            </Button>
          </form>
        </div>
      </div>
    );
  } else if (emailSent) {
    return (
      <div className={modalStyles.modal}>
        <div className={modalStyles.modalContent}>
          <h1 className="text-4xl text-blue-600 font-bold capitalize text-center">
            Email sent!
          </h1>
          <p className="text-lg text-center mt-4">
           {`We have sent an email to ${email} to change your password, if you can't see the email please also check your spam folder.`}
          </p>
        </div>
      </div>
    );
  } else if (user.value) {
    return (
      <div className={modalStyles.modal}>
        <div className={modalStyles.modalContent}>
          <Button
            color="info"
            rounded={true}
            className="absolute top-0 left-0 p-3 m-2 text-white text-lg"
            onClick={() => router.push("/login")}
          >
            <FaArrowLeft />
          </Button>
          <h1 className="text-4xl text-blue-500 font-bold capitalize text-center">
            Change your password
          </h1>
          <p className="text-lg text-center mt-4">
            Click the button below to get an email to change your password
          </p>

          <Button
            color="info"
            className="py-4 px-6 mt-3 text-xl text-white"
            onClick={() => getPwChangeEmail(user.value?.email as string)}
          >
            Change It {"->"}
          </Button>
        </div>
      </div>
    );
  } else {
    return (
      <div className={modalStyles.modal}>
        <div className={modalStyles.modalContent}>
          <Button
            color="info"
            rounded={true}
            className="absolute top-0 left-0 p-3 m-2 text-white text-lg"
            onClick={() => router.push("/login")}
          >
            <FaArrowLeft />
          </Button>

          <h1 className="text-4xl text-blue-500 font-bold capitalize text-center mb-2 mt-1">
            Change your password
          </h1>

          <div>
            <input
              onChange={changeEmail}
              className="shadow-md mb-4 mt-5 shadow-[#00000040] appearance-none border rounded w-full py-4 px-6 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              type="email"
              placeholder="What's your email ?"
            />
          </div>

          <Button
            color="info"
            className="py-3 px-6 mt-2 text-xl text-white"
            onClick={() => getPwChangeEmail(email)}
          >
            Proceed {"->"}
          </Button>
          <p className="text-sm text-gray-700 text-center mt-4">
            Click the proceed button to get an email to change your password
          </p>
        </div>
      </div>
    );
  }
};

export default ChangePassword;
