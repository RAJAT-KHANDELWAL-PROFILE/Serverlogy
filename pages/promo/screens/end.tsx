import { NextPage } from "next";
import { useRouter } from "next/router";
import { FormEvent, useContext, useEffect, useState } from "react";
import { FaArrowRight } from "react-icons/fa";
import { toast } from "react-toastify";
import Button from "../../../components/Button";
import SubscribedPage from "../../../components/SubscribedPage";
import { AppContext } from "../../../context/AppContext";
import axiosClient from "../../../utils/axiosClient";
import BASE_URL from "../../../utils/BaseURL";

const EndScreen: NextPage = () => {
  const { user, loading } = useContext(AppContext);
  const router = useRouter();
  const [title, setTitle] = useState<string>();
  const [caption, setCaption] = useState<string>();
  const [screenshot1, setScreenshot1] = useState<any>();
  const [screenshot2, setScreenshot2] = useState<any>();
  const [screenshotPreview1, setScreenshotPreview1] = useState<string>();
  const [screenshotPreview2, setScreenshotPreview2] = useState<string>();
  const [playstoreIcon, setPlaystoreIcon] = useState<"yes" | "no">("yes");
  const [appstoreIcon, setAppstoreIcon] = useState<"yes" | "no">("yes");

  useEffect(() => {
    if (!screenshot1) {
      setScreenshotPreview1("");
      return;
    }

    const objectUrl = URL.createObjectURL(screenshot1);
    setScreenshotPreview1(objectUrl);

    return () => URL.revokeObjectURL(objectUrl);
  }, [screenshot1]);

  useEffect(() => {
    if (!screenshot2) {
      setScreenshotPreview2("");
      return;
    }

    const objectUrl = URL.createObjectURL(screenshot2);
    setScreenshotPreview2(objectUrl);

    return () => URL.revokeObjectURL(objectUrl);
  }, [screenshot2]);

  useEffect(() => {
    if (user.value?.promo?.screens) {
      const screenData = user.value.promo.screens[4];
      if (screenData) {
        setScreenshotPreview1(BASE_URL + screenData.screenshot_url + "?" + Date.now());
        setDefaultScreenshot1(BASE_URL + screenData.screenshot_url);

        if (screenData.screenshot2) {
            setScreenshotPreview2(BASE_URL + screenData.screenshot_url2 + "?" + Date.now());
            setDefaultScreenshot2(BASE_URL + screenData.screenshot_url2);
        }


        setTitle(screenData.title);
        setCaption(screenData.caption);
        setPlaystoreIcon(
          user.value.promo.playstore_icon
            ? "yes"
            : "no"
        );
        setAppstoreIcon(
          user.value.promo.appstore_icon
            ? "yes"
            : "no"
        );
      }
    }
  }, [user.value]);

  const setDefaultScreenshot1 = async (url: string) => {
    const res = await fetch(url);
    const blob = await res.blob();

    const file = new File([blob], "screenshot.jpg");

    setScreenshot1(file);
  };

  const setDefaultScreenshot2 = async (url: string) => {
    const res = await fetch(url);
    const blob = await res.blob();

    const file = new File([blob], "screenshot.jpg");

    setScreenshot2(file);
  };

  const onSelectScreenshot1 = (e: FormEvent<HTMLInputElement>) => {
    if (!e.currentTarget.files || e.currentTarget.files.length === 0) {
      setScreenshot1(null);
      return;
    }

    setScreenshot1(e.currentTarget.files[0]);
  };

  const onSelectScreenshot2 = (e: FormEvent<HTMLInputElement>) => {
    if (!e.currentTarget.files || e.currentTarget.files.length === 0) {
      setScreenshot2(null);
      return;
    }

    setScreenshot2(e.currentTarget.files[0]);
  };

  const addScreen = async () => {
    if (!title || title.trim() == "") {
      toast.error("Enter a valid title");
      return;
    }
    if (title.length > 80) {
      toast.error("Title must contain less than 80 characters")
      return;
    }

    if (!caption || caption.trim() == "") {
      toast.error("Enter a valid caption");
      return;
    }

    if (caption.length > 120) {
      toast.error("Caption must contain less than 120 characters")
      return;
    }

    if (
      !screenshot1 ||
      screenshot1 == "" ||
      !screenshot2 ||
      screenshot2 == ""
    ) {
      toast.error("Please select both screenshot");
      return;
    }

    try {
      var formData = new FormData();
      formData.append("title", title);
      formData.append("caption", caption);
      formData.append("screenshot1", screenshot1);
      formData.append("screenshot2", screenshot2);
      formData.append("playstore_icon", playstoreIcon);
      formData.append("appstore_icon", appstoreIcon);

      loading.set(true);
      const { data } = await axiosClient.post(
        BASE_URL + "/promo/add_end_screen",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      if (data.success) {
        loading.set(false);
        toast.success(data.message);
        user.set(data.user);
        router.push("/promo/screens");
      }
    } catch {
      loading.set(false);
      toast.error("An error occurred");
    }
  };

  return (
    <SubscribedPage user={user}>
      <div className="min-h-[90vh] flex flex-col items-center justify-center text-center">
        <div className="flex flex-col-reverse sm:flex-row items-center justify-around w-full mt-5">
          <div className="flex flex-col items-center justify-center mt-5">
            <Button
              className="text-md rounded px-3 py-2"
              onClick={() => router.push("/promo/screens")}
            >
              {"<-"} Go Back
            </Button>
            <h4 className="capitalize text-4xl font-bold mb-6 mt-5 text-center underline">
              Edit Screen 5
            </h4>
            <input
              id="screenshotInput1"
              onChange={onSelectScreenshot1}
              className="hidden"
              type="file"
              accept="image/png,image/jpeg,image/jpg"
            />

            <input
              id="screenshotInput2"
              onChange={onSelectScreenshot2}
              className="hidden"
              type="file"
              accept="image/png,image/jpeg,image/jpg"
            />

            <input
              onChange={(e) => setTitle(e.target.value)}
              className="shadow-md my-3 shadow-[#00000040] appearance-none border rounded w-[80vw] sm:w-[40vw] p-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              type="text"
              value={title}
              placeholder="Enter screen title"
            />

            <textarea
              onChange={(e) => setCaption(e.target.value)}
              className="shadow-md my-3 resize-none w-[80vw] sm:w-[40vw] shadow-[#00000040] h-[150px] appearance-none border rounded p-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              value={caption}
              placeholder="Enter screen caption"
            ></textarea>

            <p className="text-md text-gray-600 font-bold">
              Do you want app store icon ?
            </p>
            <select value={appstoreIcon} onChange={(e) => setAppstoreIcon(e.target.value == "yes" ? "yes" : "no")} className="shadow-md mb-3 mt-1 shadow-[#00000040] appearance-none border rounded w-[80vw] sm:w-[40vw] p-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline">
              <option value="yes">Yes</option>
              <option value="no">No</option>
            </select>


            <p className="text-md text-gray-600 font-bold">
              Do you want play store icon ?
            </p>
            <select value={playstoreIcon} onChange={(e) => setPlaystoreIcon(e.target.value == "yes" ? "yes" : "no")} className="shadow-md mb-3 mt-1 shadow-[#00000040] appearance-none border rounded w-[80vw] sm:w-[40vw] p-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline">
              <option value="yes">Yes</option>
              <option value="no">No</option>
            </select>


            <label
              htmlFor="screenshotInput1"
              className="box w-[200px] sm:w-[300px] sm:hidden block aspect-[9/16] bg-gray-200 rounded w-full relative my-5 mx-auto border-[1px] border-gray-500"
            >
              {screenshotPreview1 ? (
                <img
                  src={screenshotPreview1}
                  alt=""
                  className="absolute w-[100%] h-[100%] top-0 left-0 rounded hover:opacity-[0.6]"
                />
              ) : (
                <p className="absolute top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] text-sm text-gray-500">
                  No Screenshot Selected
                  <br />
                  {"(Tap to Select)"}
                </p>
              )}
            </label>

            <label
              htmlFor="screenshotInput2"
              className="box w-[200px] sm:w-[300px] sm:hidden block aspect-[9/16] bg-gray-200 rounded w-full relative my-5 mx-auto border-[1px] border-gray-500"
            >
              {screenshotPreview2 ? (
                <img
                  src={screenshotPreview2}
                  alt=""
                  className="absolute w-[100%] h-[100%] top-0 left-0 rounded hover:opacity-[0.6]"
                />
              ) : (
                <p className="absolute top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] text-sm text-gray-500">
                  No Screenshot Selected
                  <br />
                  {"(Tap to Select)"}
                </p>
              )}
            </label>

            <Button
              color="dark"
              className="px-5 py-3 mt-3 rounded-full text-xl"
              onClick={addScreen}
            >
              Add Screen
            </Button>
          </div>

          <div className="flex flex-row">
            <label
              htmlFor="screenshotInput1"
              className="box w-[180px] sm:block hidden aspect-[9/16] bg-gray-200 rounded w-full relative my-5 mx-1 border-[1px] border-gray-500"
            >
              {screenshotPreview1 ? (
                <img
                  src={screenshotPreview1}
                  alt=""
                  className="absolute w-[100%] h-[100%] top-0 left-0 rounded hover:opacity-[0.6]"
                />
              ) : (
                <p className="absolute top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] text-sm text-gray-500 w-[100%]">
                  <b className="pb-3">1st Screenshot</b>
                  <br />
                  No Screenshot Selected
                  <br />
                  {"(Tap to Select)"}
                </p>
              )}
            </label>

            <label
              htmlFor="screenshotInput2"
              className="box w-[180px] sm:block hidden aspect-[9/16] bg-gray-200 rounded w-full relative my-5 mx-1 border-[1px] border-gray-500"
            >
              {screenshotPreview2 ? (
                <img
                  src={screenshotPreview2}
                  alt=""
                  className="absolute w-[100%] h-[100%] top-0 left-0 rounded hover:opacity-[0.6]"
                />
              ) : (
                <p className="absolute top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] text-sm text-gray-500 w-[100%]">
                  <b className="pb-3">2nd Screenshot</b>
                  <br />
                  No Screenshot Selected
                  <br />
                  {"(Tap to Select)"}
                </p>
              )}
            </label>
          </div>
        </div>
      </div>
    </SubscribedPage>
  );
};

export default EndScreen;
