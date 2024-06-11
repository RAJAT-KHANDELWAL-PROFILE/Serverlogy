import type { NextPage } from "next";
import { useRouter } from "next/router";
import { useContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import Button from "../components/Button";
import { AppContext } from "../context/AppContext";
import modalStyles from "../styles/Modal.module.css";
import axiosClient from "../utils/axiosClient";
import BASE_URL from "../utils/BaseURL";

const Verify: NextPage = () => {
  const { user, loading } = useContext(AppContext);
  const router = useRouter();
  const [emailSent, setEmailSent] = useState<Boolean>(false);
  const [verificationStarted, setVerificationStarted] =
    useState<Boolean>(false);

  useEffect(() => {
    if (user.value) {
      if (user.value.verified) {
        router.push("/dashboard");
      } else {
        const { token } = router.query;

        if (token && !verificationStarted) {
          setVerificationStarted(true);
          verifyUser(token as string);
        }
      }
    }
  }, [user.value]);

  const sendVerificationEmail = async () => {
    try {
      loading.set(true);
      const { data } = await axiosClient.get(BASE_URL + "/user/verify");
      setEmailSent(true);
      toast.success(data.message);
      loading.set(false);
    } catch (e: any) {
      if (e.response.data.message) {
        toast.error(e.response.data.message);
      }
      loading.set(false);
    }
  };

  const verifyUser = async (token: string) => {
    try {
      loading.set(true);
      const { data } = await axiosClient.post(BASE_URL + "/user/verify", {
        token,
      });

      if (data.success) {
        loading.set(false);
        toast.success("User is verified now");
        if (user.value) {
          user.set({ ...user.value, verified: true });
        }
      } else {
        alert("Invalid request");
        location.href = "/verify";
      }
    } catch (e) {
      alert("Invalid request");
      location.href = "/verify";
    }
  };

  if (user.value) {
    if (emailSent) {
      return (
        <div className={modalStyles.modal}>
          <div className={modalStyles.modalContent}>
            <h1 className="text-4xl text-yellow-600 font-bold capitalize text-center">
              Verification email sent
            </h1>
            <p className="text-lg text-center mt-4">
              We have sent an verification email to {user.value.email}, if you cannot see the email please also check your spam folder.
            </p>
          </div>
        </div>
      );
    }

    return (
      <div className={modalStyles.modal}>
        <div className={modalStyles.modalContent}>
          <h1 className="text-4xl text-yellow-600 font-bold capitalize text-center">
            Verify your email
          </h1>
          <p className="text-lg text-center mt-4">
            Your email is not verified please verify your email to perform
            further actions.
          </p>

          <Button
            color="warning"
            className="py-4 px-6 mt-3 text-xl"
            onClick={sendVerificationEmail}
          >
            Verify Now
          </Button>
        </div>
      </div>
    );
  } else {
    return <></>;
  }
};

export default Verify;
