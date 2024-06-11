import { FormEvent, useContext, useEffect, useState } from "react";
import { FaArrowRight } from "react-icons/fa";
import { toast } from "react-toastify";
import { AppContext } from "../../context/AppContext";
import axiosClient from "../../utils/axiosClient";
import BASE_URL from "../../utils/BaseURL";
import Button from "../../components/Button";
import SubscribedPage from "../../components/SubscribedPage";
import { useRouter } from "next/router";

const DownloadPromo = () => {
  const { user, loading } = useContext(AppContext);
  const router = useRouter();
  const { previous } = router.query;

  useEffect(() => {
    if (user.value?.promo) {
      if (!user.value?.promo?.created) {
        router.push("/promo/create");
      }
    }
  }, [user.value]);

  const downloadPromo = async () => {
    try {
      loading.set(true);
      const { data } = await axiosClient.get(BASE_URL + "/promo/download", {
        responseType: "blob",
      });

      const blob = new Blob([data]);
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "output.mp4");
      document.body.appendChild(link);
      link.click();

      loading.set(false);
      toast.success("Promo downloaded successfully");
      router.push("/promo/create");
    } catch {
      loading.set(false);
      toast.error("An error occurred");
    }
  };

  if (previous === "true") {
    return (
      <SubscribedPage user={user}>
        <div className="min-h-[90vh] flex flex-col items-center justify-center text-center px-[8px]">
          <h4 className="capitalize text-4xl font-bold mb-2 text-center">
            Download Previous Promo
          </h4>

          <p className="text-lg text-gray-700">
            You can download your previous promo from here
          </p>

          <Button
            color="dark"
            className="py-3 px-4 font-bold text-lg mt-4"
            onClick={downloadPromo}
          >
            Download Now
          </Button>
        </div>
      </SubscribedPage>
    );
  }

  return (
    <SubscribedPage user={user}>
      <div className="min-h-[90vh] flex flex-col items-center justify-center text-center px-[8px]">
        <h4 className="capitalize text-4xl font-bold mb-2 text-center">
          Download your promo
        </h4>

        <p className="text-lg text-gray-700">
          You can download your created promo from here
        </p>

        <Button
          color="dark"
          className="py-3 px-4 font-bold text-lg mt-4"
          onClick={downloadPromo}
        >
          Download Now
        </Button>
      </div>
    </SubscribedPage>
  );
};

export default DownloadPromo;
