import { useContext, useEffect, useState } from "react";
import { FaArrowRight } from "react-icons/fa";
import { toast } from "react-toastify";
import { AppContext } from "../../context/AppContext";
import axiosClient from "../../utils/axiosClient";
import BASE_URL from "../../utils/BaseURL";
import Button from "../../components/Button";
import SubscribedPage from "../../components/SubscribedPage";
import { useRouter } from "next/router";

const ChangeAppName = () => {
  const { user, loading } = useContext(AppContext);
  const [appname, setAppName] = useState<string>("");
  const router = useRouter();

  useEffect(() => {
    if (user.value?.promo?.appname) {
      setAppName(user.value.promo.appname)
    }
  }, [user.value])

  const changeAppName = async () => {
    if (!appname || appname.trim() == "") {
      toast.error("Enter your app name");
      return;
    }
    else if (appname.length > 80) {
      toast.error("Appname must contain less than 80 characters")
      return;
    }
    try {
      loading.set(true);
      const { data } = await axiosClient.post(
        BASE_URL + "/promo/update_appname",
        { appname }
      );
      if (data.success) {
        loading.set(false);
        toast.success("App name updated");
        user.set(data.user);
        router.push("/promo/create")
      }
    } catch {
      loading.set(false);
      toast.error("An error occurred");
    }
  };

  return (
    <SubscribedPage user={user}>
      <div className="min-h-[90vh] flex flex-col items-center justify-center text-center px-[8px]">
        <h4 className="capitalize text-4xl font-bold mb-2 text-center">
          Enter Your app name
        </h4>
        <div>
          <input
            onChange={(e) => setAppName(e.target.value)}
            className="shadow-md mb-4 mt-5 shadow-[#00000040] appearance-none border rounded w-full p-4 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            type="text"
            value={appname}
            placeholder="Enter your cool app name"
          />
        </div>

        <Button
          color="dark"
          className="p-4 mt-3 rounded-full text-3xl"
          onClick={changeAppName}
        >
          <FaArrowRight />
        </Button>
      </div>
    </SubscribedPage>
  );
};

export default ChangeAppName;
