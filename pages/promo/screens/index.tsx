import { useContext, useState } from "react";
import { FaArrowRight } from "react-icons/fa";
import { toast } from "react-toastify";
import { AppContext } from "../../../context/AppContext";
import axiosClient from "../../../utils/axiosClient";
import BASE_URL from "../../../utils/BaseURL";
import Button from "../../../components/Button";
import SubscribedPage from "../../../components/SubscribedPage";
import { useRouter } from "next/router";


const Screens = () => {
  const { user, loading } = useContext(AppContext);
  const [screens, setScreen] = useState<string>();
  const router = useRouter();

  return (
    <SubscribedPage user={user}>
      <div className="min-h-[90vh] flex flex-col items-center justify-center text-center">
        <h4 className="capitalize text-4xl font-bold mb-4 mt-4 text-center">
          Edit your promo screens
        </h4>

        <div className="mb-4 flex flex-row flex-wrap items-center justify-center">
          {[1, 2, 3, 4, 5].map((v, i) => (
            <div
              onClick={() => router.push(`/promo/screens/${i}`)}
              key={i}
              className="p-4 mt-3 rounded mx-2 text-lg text-black bg-gray-300 border-[2px] text-gray-800 flex flex-col items-center justify-evenly cursor-pointer hover:bg-gray-400 hover:translate-y-[-4px] duration-[0.3s] border-gray-400 w-[200px] h-[200px]"
            >
              <h2 className="text-md bg-dark rounded-full p-1 aspect-square my-1 bg-[#27272a] text-white">
                {v}
              </h2>

              <div>
                {user.value?.promo?.screens && user.value.promo.screens[i] ? (
                  <p className="break-all">{user.value.promo.screens[i].title.slice(0, 50)}...</p>
                ) : (
                  <>
                    <h2 className="text-md font-medium text-gray-600">
                      Screen {v}
                    </h2>
                    <h2 className="text-sm font-regular text-gray-600">
                      Nothing available here...
                    </h2>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>

        {user.value?.promo?.screens ? (
          user.value.promo.screens.length == 5 &&
          !user.value.promo.screens.includes(null!) ? (
            <Button
              color="dark"
              className="p-4 mt-3 rounded-full mx-2 text-3xl"
              onClick={() => router.push("/promo/create")}
            >
              <FaArrowRight />
            </Button>
          ) : (
            <>
              <Button
                color="dark"
                disabled={true}
                className="p-4 mt-3 rounded-full mx-2 text-3xl"
              >
                <FaArrowRight />
              </Button>
              <p className="text-gray-500 mt-3 text-sm">
                Complete all the screens to move ahead
              </p>
            </>
          )
        ) : (
          <></>
        )}
      </div>
    </SubscribedPage>
  );
};

export default Screens;
