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


const Screen: NextPage = () => {
  const { user, loading } = useContext(AppContext);
  const router = useRouter();
  const { screen } = router.query;
  const available_screens = ["0", "1", "2", "3", "4"];
  const [title, setTitle] = useState<string>();
  const [caption, setCaption] = useState<string>();
  const [screenshot, setScreenshot] = useState<any>();
  const [screenshotPreview, setScreenshotPreview] = useState<string>();

  useEffect(() => {
    if (!available_screens.includes(screen as string)) {
      router.push("/promo/screens");
    }
    if (screen == "4") {
      router.push("/promo/screens/end")
    }
  }, [user.value]);

  useEffect(() => {
    if (!screenshot) {
      setScreenshotPreview("");
      return;
    }

    const objectUrl = URL.createObjectURL(screenshot);
    setScreenshotPreview(objectUrl);

    return () => URL.revokeObjectURL(objectUrl);
  }, [screenshot]);

  useEffect(() => {
    if (user.value?.promo?.screens) {
      const screenData = user.value.promo.screens[Number(screen)]
      if (screenData) {
        setScreenshotPreview(BASE_URL + screenData.screenshot_url + "?" + Date.now())
        setDefaultScreenshot(BASE_URL + screenData.screenshot_url)
        setTitle(screenData.title)
        setCaption(screenData.caption)
      }
    }
  }, [user.value])

  const setDefaultScreenshot = async (url: string) => {
    const res = await fetch(url)
    const blob = await res.blob()

    const file = new File([blob], "screenshot.jpg")

    setScreenshot(file)
  }

  const onSelectScreenshot = (e: FormEvent<HTMLInputElement>) => {
    if (!e.currentTarget.files || e.currentTarget.files.length === 0) {
      setScreenshot(null);
      return;
    }
    
    setScreenshot(e.currentTarget.files[0]);
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
    if (!screenshot || screenshot == "") {
      toast.error("Please select a screenshot");
      return;
    }

    try {
      var formData = new FormData();
      formData.append("screen", screen as string);
      formData.append("title", title);
      formData.append("caption", caption);
      formData.append("screenshot", screenshot);

      loading.set(true);
      const { data } = await axiosClient.post(
        BASE_URL + "/promo/add_screen",
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
            <Button className="text-md rounded px-3 py-2" onClick={() => router.push("/promo/screens")}>{"<-"} Go Back</Button>
            <h4 className="capitalize text-4xl font-bold mb-6 mt-5 text-center underline">
              Edit Screen {Number(screen) + 1}
            </h4>
            <input
              id="screenshotInput"
              onChange={onSelectScreenshot}
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

            <label
              htmlFor="screenshotInput"
              className="box w-[200px] sm:w-[300px] sm:hidden block aspect-[9/16] bg-gray-200 rounded w-full relative my-5 mx-auto border-[1px] border-gray-500"
            >
              {screenshotPreview ? (
                <img
                  src={screenshotPreview}
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

          <label
            htmlFor="screenshotInput"
            className="box w-[200px] sm:w-[300px] sm:block hidden aspect-[9/16] bg-gray-200 rounded w-full relative my-5 mx-1 border-[1px] border-gray-500"
          >
            {screenshotPreview ? (
              <img
                src={screenshotPreview}
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
        </div>
      </div>
    </SubscribedPage>
  );
};

export default Screen;
