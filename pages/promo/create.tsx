import { NextPage } from "next";
import { FormEvent, useContext, useEffect, useState } from "react";
import SubscribedPage from "../../components/SubscribedPage";
import { AppContext } from "../../context/AppContext";
import { useRouter } from "next/router";
import Button from "../../components/Button";
import { FaPen } from "react-icons/fa";
import { toast } from "react-toastify";
import BASE_URL from "../../utils/BaseURL";
import axiosClient from "../../utils/axiosClient";
import loadingStyles from "../../styles/Loading.module.css";
import Link from "next/link";

const CreatePromo: NextPage = () => {
  const { user, loading, refreshUser } = useContext(AppContext);
  const router = useRouter();
  const [loading_, setLoading] = useState<Boolean>(false);
  const [initialLoading, setInitialLoading] = useState<Boolean>(true);

  useEffect(() => {
    if (user.value) {
      if (!user.value.promo?.appname) {
        router.push("/promo/appname");
      } else if (!user.value.promo.description) {
        router.push("/promo/description");
      } else if (!user.value.promo.logo || !user.value.promo.logo_url) {
        router.push("/promo/logo");
      } else if (
        !user.value.promo.main_screenshot ||
        !user.value.promo.main_screenshot_url
      ) {
        router.push("/promo/screenshot");
      } else if (!user.value.promo.audio || !user.value.promo.audio_url) {
        router.push("/promo/audio");
      } else if (user.value.promo.screens) {
        if (user.value.promo.screens.length < 5) {
          router.push("/promo/screens");
        } else if (user.value.promo.screens.includes(null!)) {
          router.push("/promo/screens");
        } else {
          setInitialLoading(false);
        }
      } else {
        setInitialLoading(false);
      }
    }
  }, [user.value]);

  const createPromo = async () => {
    try {
      setLoading(true);
      const { data } = await axiosClient.get(BASE_URL + "/promo/create");

      if (data.success) {
        toast.success(data.message);
        setLoading(true);
        refreshUser();
        router.push("/promo/download");
      } else {
        setLoading(false);
        toast.error(data.message);
      }
    } catch {
      toast.error("An error occurred");
      setLoading(false);
    }
  };

  return (
    <SubscribedPage user={user}>
      {initialLoading ? (
        <div className={loadingStyles.loading} style={{ background: "black" }}>
          <div className={loadingStyles.loader}>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
          </div>
        </div>
      ) : loading_ ? (
        <div className={loadingStyles.loading} style={{ background: "black" }}>
          <div className={loadingStyles.loader}>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
          </div>
          <p className="text-white text-xl capitalize font-semibold text-center">
            Processing your promo...
          </p>
          <p className="text-white text-sm text-center">
            Please wait for 3-5 minutes
          </p>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center mt-[40px] min-h-[90vh] px-[8px]">
          <h1 className="capitalize text-5xl font-bold my-3 text-center text-center">
            Create Promo
          </h1>

          <div className="flex flex-col items-start justify-center mt-[15px] w-[90vw] sm:w-[70vw]">
            <p className="text-lg text-gray-600">
              <span className="font-bold">App Name:</span>
            </p>
            <div className="w-[100%] bg-white border-2 border-gray-500 rounded p-3 flex flex-row items-center justify-between">
              <span>{user.value?.promo?.appname?.slice(0, 100)}</span>

              <FaPen
                className="cursor-pointer"
                onClick={() => router.push("/promo/appname")}
              />
            </div>

            <p className="text-lg text-gray-600 mt-10">
              <span className="font-bold">Description:</span>{" "}
            </p>
            <div className="w-[100%] bg-white border-2 border-gray-500 rounded p-3 flex flex-row items-center justify-between">
              <span>{user.value?.promo?.description?.slice(0, 150)}</span>

              <FaPen
                className="cursor-pointer"
                onClick={() => router.push("/promo/description")}
              />
            </div>

            <div className="flex justify-between flex-col items-center lg:flex-row lg:items-start w-full mt-10">
              <div className="mt-8">
                <p className="text-lg text-gray-600">
                  <span className="font-bold">Logo:</span>{" "}
                </p>
                <div className="relative mt-3">
                  <img
                    src={BASE_URL + user.value?.promo?.logo_url + "?" + Date.now()}
                    alt=""
                    className="w-[200px] aspect-1 rounded-full"
                  />
                  <button
                    onClick={() => router.push("/promo/logo")}
                    className="absolute rounded-full bg-black text-white top-0 right-0 text-lg p-3"
                  >
                    <FaPen />
                  </button>
                </div>
              </div>

              <div className="mt-8">
                <p className="text-lg text-gray-600">
                  <span className="font-bold">Audio:</span>{" "}
                </p>
                <div className="relative mt-3">
                  <button
                    onClick={() => router.push("/promo/audio")}
                    className="absolute rounded-full bg-black text-white top-[-100%] right-0 text-lg p-3"
                  >
                    <FaPen />
                  </button>
                  <audio controls={true}>
                    <source
                      src={BASE_URL + user.value?.promo?.audio_url + "?" + Date.now()}
                      type="audio/mp3"
                    />
                  </audio>
                </div>
              </div>

              <div>
                <p className="text-lg text-gray-600 mt-8">
                  <span className="font-bold">Main Screenshot:</span>{" "}
                </p>
                <div className="relative mt-3">
                  <img
                    src={BASE_URL + user.value?.promo?.main_screenshot_url + "?" + Date.now()}
                    alt=""
                    className="w-[150px] aspect-[9/16] rounded"
                  />

                  <button
                    onClick={() => router.push("/promo/screenshot")}
                    className="absolute rounded-full bg-black text-white top-[-10px] right-[-10px] text-lg p-3"
                  >
                    <FaPen />
                  </button>
                </div>
              </div>
            </div>

            <div className="w-[100%]">
              <p className="text-lg text-gray-600 mt-[30px]">
                <span className="font-bold">Screens:</span>
              </p>
              <div className="mb-4 flex flex-col lg:flex-row items-center justify-between w-[100%]">
                {[1, 2, 3, 4, 5].map((v, i) => (
                  <div
                    onClick={() => router.push(`/promo/screens`)}
                    key={i}
                    className="p-3 mt-3 rounded mx-2 text-lg text-black bg-gray-300 border-[2px] text-gray-800 flex flex-col items-center justify-evenly cursor-pointer hover:bg-gray-400 hover:translate-y-[-4px] duration-[0.3s] border-gray-400 w-full lg:w-1/5 h-[200px]"
                  >
                    <span className="text-sm bg-dark rounded-full aspect-square p-2 my-1 bg-[#27272a] text-white text-center">
                      {v}
                    </span>
                    <div>
                      {user.value?.promo?.screens &&
                      user.value.promo.screens[i] ? (
                        <p className="break-all text-sm">
                          {user.value.promo.screens[i].title.slice(0, 50)}...
                        </p>
                      ) : (
                        <></>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <Button
              color="dark"
              className="py-2 px-3 w-full mt-[30px] text-lg"
              transform="uppercase"
              onClick={createPromo}
            >
              Create Now
            </Button>
            <p className="text-md text-center mt-[10px]">To download previously created promo <Link href="/promo/download?previous=true"><span className="underline text-blue-600 cursor-pointer">Click here</span></Link>.</p>
          </div>
        </div>
      )}
    </SubscribedPage>
  );
};

export default CreatePromo;
