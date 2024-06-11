import { NextPage } from "next";
import { useRouter } from "next/router";
import { useContext, useEffect } from "react";
import Button from "../../components/Button";
import ProtectedPage from "../../components/ProtectedPage";
import Subscritpion from "../../components/Subscription";
import { AppContext } from "../../context/AppContext";
import axiosClient from "../../utils/axiosClient";
import BASE_URL from "../../utils/BaseURL";

const Dashboard: NextPage = () => {
  const { user, loading } = useContext(AppContext);
  const router = useRouter();

  useEffect(() => {
    if (user.value?.subscription?.subscribed) {
      loading.set(true);
      axiosClient.get(BASE_URL + "/user/check_subscription").then((res) => {
        user.set(res.data.user)
        loading.set(false)
      }).catch(() => {
        console.log("An error occurred");
      }) 
    }
  }, [])


  return (
    <ProtectedPage user={user}>
      {user.value?.subscription?.subscribed ? (
        <div className="min-h-[90vh] flex flex-col items-center justify-center bg-gray-200 mb-10">
          <h2 className="text-4xl sm:text-5xl text-black font-bold text-center mx-2">
            Create A great promo for your app
          </h2>
          <Button
            color="dark"
            onClick={() => router.push("/promo/create")}
            className="px-4 py-3 text-xl mt-5"
          >
            Create Here!
          </Button>

          <Subscritpion />
        </div>
      ) : (
        <div className="min-h-[90vh] flex flex-col items-center justify-center bg-gray-200 mb-10">
          <h2 className="text-5xl text-black font-extrabold mb-4 capitalize text-center">
            Welcome <span className="text-zinc-700">{user.value?.name}</span>
          </h2>
          <Button
            color="dark"
            className="py-3 px-6 mt-2 text-lg text-white"
            onClick={() => router.push("/pricing")}
          >
            Choose your plan {"->"}
          </Button>
        </div>
      )}
    </ProtectedPage>
  );
};

export default Dashboard;
