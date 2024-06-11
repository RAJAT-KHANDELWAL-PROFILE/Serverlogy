import { AppContext } from "../context/AppContext";
import { useContext } from "react";
import { FaCheckCircle, FaExclamationCircle, FaInfoCircle } from "react-icons/fa";
import { useRouter } from "next/router";

const Subscritpion = () => {
  const { user } = useContext(AppContext);
  const router = useRouter();

  if (user.value) {
    if (user.value.subscription?.subscribed) {
      return (
        <div className="mt-5 bg-green-200 border-2 border-green-500 rounded-lg m-3 px-3 py-3 text-center flex sm:flex-row flex-col items-center justify-center">
          <FaCheckCircle className="text-green-700 text-5xl mb-2 sm:text-2xl sm:mb-0 mr-3" />
          <p className="text-lg text-green-700">
            You have a active subscription till{" "}
            <span className="font-bold">
              {user?.value?.subscription?.expire?.toString().slice(0, 16)}
            </span>
          </p>
        </div>
      );
    }

    if (!user.value.subscription?.freetrial_taken) {
      return (
        <div className="mt-5 bg-blue-200 border-2 border-blue-500 rounded-lg m-3 px-3 py-3 text-center flex sm:flex-row flex-col items-center justify-center">
          <FaExclamationCircle className="text-blue-700 text-5xl mb-2 sm:text-2xl sm:mb-0 mr-3" />
          <p className="text-lg text-blue-700">
            <a
              onClick={() => router.push("/pricing")}
              className="font-bold text-blue-900 hover:underline cursor-pointer"
            >
              Get your free trial now!
            </a>
          </p>
        </div>
      );
    }

    return (
      <div className="mt-5 bg-yellow-200 border-2 border-yellow-500 rounded-lg m-3 px-3 py-3 text-center flex sm:flex-row flex-col items-center justify-center">
        <FaInfoCircle className="text-yellow-700 text-5xl mb-2 sm:text-2xl sm:mb-0 mr-3" />
        <p className="text-lg text-yellow-700">
          <a
            onClick={() => router.push("/pricing")}
            className="font-bold text-yellow-900 hover:underline cursor-pointer"
          >
            Subscribe Now
          </a>{" "}
          to create awesome promo for your app.
        </p>
      </div>
    );
  }

  return <></>;
};

export default Subscritpion;
