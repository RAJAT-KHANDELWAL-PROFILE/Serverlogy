import { FormEvent, useContext, useEffect, useState } from "react";
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
  const [logo, setLogo] = useState<any>(null);
  const [logoPreview, setLogoPreview] = useState<string>();
  const router = useRouter();

  useEffect(() => {
    if (logo == "DEFAULT_LOGO_") {
      return;
    }
    if (!logo) {
      setLogoPreview("");
      return;
    }

    const objectUrl = URL.createObjectURL(logo);
    setLogoPreview(objectUrl);

    return () => URL.revokeObjectURL(objectUrl);
  }, [logo]);

  useEffect(() => {
    if (user.value?.promo?.logo_url) {
      setLogoPreview(BASE_URL + user.value.promo.logo_url + "?" + Date.now());
      setLogo("DEFAULT_LOGO_");
    }
  }, [user.value]);

  const onSelectLogo = (e: FormEvent<HTMLInputElement>) => {
    if (!e.currentTarget.files || e.currentTarget.files.length === 0) {
      setLogo(null);
      return;
    }

    setLogo(e.currentTarget.files[0]);
  };

  const changeLogo = async () => {
    if (logo == "DEFAULT_LOGO_") {
      router.push("/promo/create");
      return;
    }
    if (!logo || logo == "") {
      toast.error("Please select a logo");
      return;
    }
    try {
      var formData = new FormData();
      formData.append("logo", logo);

      loading.set(true);
      const { data } = await axiosClient.post(
        BASE_URL + "/promo/update_logo",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      if (data.success) {
        user.set(data.user);
        loading.set(false);
        toast.success(data.message);
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
          Set your app logo
        </h4>

        <input
          onChange={onSelectLogo}
          className="hidden"
          type="file"
          id="logoInput"
          accept="image/png,image/jpeg,image/jpeg"
        />

        <label
          htmlFor="logoInput"
          className="box w-[200px] h-[200px] bg-gray-200 rounded-full relative my-5 mx-2 border-[1px] border-gray-500"
        >
          {logoPreview ? (
            <img
              src={logoPreview}
              alt=""
              className="absolute w-[100%] h-[100%] top-0 left-0 rounded-full hover:opacity-[0.6]"
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
          onClick={changeLogo}
        >
          <FaArrowRight />
        </Button>
      </div>
    </SubscribedPage>
  );
};

export default ChangeAppName;
