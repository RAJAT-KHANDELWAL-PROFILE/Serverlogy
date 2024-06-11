import { NextPage } from "next";
import { useContext, useState } from "react";
import ProtectedPage from "../../components/ProtectedPage";
import { AppContext } from "../../context/AppContext";
import { AiOutlineUser, AiFillSetting } from "react-icons/ai";
import Button from "../../components/Button";
import { toast } from "react-toastify";
import axiosClient from "../../utils/axiosClient";
import BASE_URL from "../../utils/BaseURL";
import Modal from "../../components/Modal";
import { useRouter } from "next/router";
import Subscritpion from "../../components/Subscription";

const Profile: NextPage = () => {
  const { user, loading } = useContext(AppContext);
  const [logoutModal, setLogoutModal] = useState<Boolean>(false);
  const [settings, setSettings] = useState<Boolean>(false);
  const router = useRouter()

  const logout = async () => {
    try {
      loading.set(true);
      const { data } = await axiosClient.get(BASE_URL + "/user/logout");
      user.set(null);
      loading.set(false);
      toast.success(data.message);
    } catch (e: any) {
      if (e.response.data.message) {
        toast.error(e.response.data.message);
      }
      loading.set(false);
    }
    setLogoutModal(false);
  };

  return (
    <ProtectedPage user={user}>
      <div className="min-h-[90vh] flex flex-col items-center justify-center">
        <h2 className="text-5xl text-black font-extrabold mb-4 text-center mt-5">
          Your Account
        </h2>

        <div className="relative my-4">
          <AiOutlineUser
            style={{ width: "200px", height: "200px" }}
            className="font-bold bg-gray-600 text-white rounded-full p-4 "
          />
          <button onClick={() => setSettings(true)}>
            <AiFillSetting className="absolute top-0 right-0 text-black hover:text-gray-900" style={{ width: "50px", height: "50px" }} />
          </button>
        </div>

        <p className="text-4xl text-black font-medium">
          {user.value?.name?.split(" ")[0]}
        </p>
        <p className="text-lg text-gray-500 font-medium">{user.value?.email}</p>
        <Button
          color="warning"
          className="py-4 text-xl px-8 mt-5"
          transform="uppercase"
          onClick={() => setLogoutModal(true)}
        >
          Logout
        </Button>

        <Subscritpion />

        <Modal show={logoutModal} setShow={setLogoutModal}>
          <p className="text-2xl text-medium">Do you want to logout ?</p>
          <Button
            color="success"
            rounded={true}
            transform="uppercase"
            onClick={logout}
            className="py-4 text-xl text-medium px-8 mt-5"
          >
            Yes
          </Button>
        </Modal>

        <Modal show={settings} setShow={setSettings}>
          <Button
            color="info"
            className="py-3 my-1 text-md font-light px-8 w-full text-white"
            onClick={() => router.push("/change_password")}
          >
            Change Password
          </Button>

          <Button
            color="dark"
            className="py-3 my-1 text-md font-light px-8 w-full"
            onClick={() => window.open("https://servelogy.com/contact-us", "contact")}
          >
            Get Help
          </Button>

          <Button
            color="error"
            className="py-3 my-1 text-md font-light px-8 w-full text-white"
          >
            Report Bug
          </Button>
        </Modal>
      </div>
    </ProtectedPage>
  );
};

export default Profile;
