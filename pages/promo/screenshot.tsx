import { FormEvent, useContext, useEffect, useState } from "react";
import { FaArrowRight } from "react-icons/fa";
import { toast } from "react-toastify";
import { AppContext } from "../../context/AppContext";
import axiosClient from "../../utils/axiosClient";
import BASE_URL from "../../utils/BaseURL";
import Button from "../../components/Button";
import { useRouter } from "next/router";
import SubscribedPage from "../../components/SubscribedPage";

const Screenshot = () => {
  const { user, loading } = useContext(AppContext);
  const [screenshot, setScreenshot] = useState<any>(null);
  const [screenshotPreview, setScreenshotPreview] = useState<string>();
  const router = useRouter();

  useEffect(() => {
    if (screenshot == "DEFAULT_SCREENSHOT_") {
      return;
    }
    if (!screenshot) {
      setScreenshotPreview("");
      return;
    }

    const objectUrl = URL.createObjectURL(screenshot);
    setScreenshotPreview(objectUrl);

    return () => URL.revokeObjectURL(objectUrl);
  }, [screenshot]);

  useEffect(() => {
    if (user.value?.promo?.main_screenshot_url) {
      setScreenshotPreview(BASE_URL + user.value.promo.main_screenshot_url + "?" + Date.now());
      setScreenshot("DEFAULT_SCREENSHOT_");
    }
  }, [user.value]);

  const onSelectScreenshot = (e: FormEvent<HTMLInputElement>) => {
    if (!e.currentTarget.files || e.currentTarget.files.length === 0) {
      setScreenshot(null);
      return;
    }

    setScreenshot(e.currentTarget.files[0]);
  };

  const changeScreenshot = async () => {
    if (screenshot == "DEFAULT_SCREENSHOT_") {
      router.push("/promo/create");
      return;
    }
    if (!screenshot || screenshot == "") {
      toast.error("Please select a screenshot");
      return;
    }
    try {
      var formData = new FormData();
      formData.append("screenshot", screenshot);

      loading.set(true);
      const { data } = await axiosClient.post(
        BASE_URL + "/promo/update_mainscreenshot",
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
        router.push("/promo/create");
      }
    } catch {
      loading.set(false);
      toast.error("An error occurred");
    }
  };

  return (
    <SubscribedPage user={user}>
      <div className="min-h-[90vh] flex flex-col items-center justify-center text-center">
        <h4 className="capitalize text-4xl font-bold mb-2 text-center px-[8px]">
          Set main screenshot
        </h4>

        <input
          onChange={onSelectScreenshot}
          className="hidden"
          type="file"
          id="screenshotInput"
          accept="image/png,image/jpeg,image/jpeg"
        />

        <label
          htmlFor="screenshotInput"
          className="box w-[200px] aspect-[9/16] bg-gray-200 rounded relative my-5 mx-2 border-[1px] border-gray-500"
        >
          {screenshotPreview ? (
            <img
              src={screenshotPreview}
              alt=""
              className="absolute w-[100%] h-[100%] top-0 left-0 rounded hover:opacity-[0.6]"
            />
          ) : (
            <p className="absolute top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] text-sm text-gray-500">
              No file Selected
            </p>
          )}
        </label>

        <p className="text-center mt-2 mb-4 text-gray-400 text-md">
          Tap to select
        </p>

        <Button
          color="dark"
          className="p-4 mt-3 rounded-full text-3xl"
          onClick={changeScreenshot}
        >
          <FaArrowRight />
        </Button>
      </div>
    </SubscribedPage>
  );
};

export default Screenshot;
