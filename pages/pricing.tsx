import { useRouter } from "next/router";
import { useEffect } from "react";
import { useContext } from "react";
import { toast } from "react-toastify";
import Button from "../components/Button";
import { AppContext } from "../context/AppContext";
import axiosClient from "../utils/axiosClient";
import BASE_URL from "../utils/BaseURL";
import loadScript from "../utils/loadScript";
import { FaLock } from "react-icons/fa";

const Pricing = () => {
  const { user, loading, refreshUser } = useContext(AppContext);
  const router = useRouter();

  useEffect(() => {
    if (user.value?.subscription?.subscribed) {
      router.push("/dashboard");
    }
  }, [user.value]);

  const handlePaymentSuccess = async (res: any) => {
    const data = {
      razorpay_payment_id: res.razorpay_payment_id,
      razorpay_order_id: res.razorpay_order_id,
      razorpay_signature: res.razorpay_signature,
    };

    const r = await axiosClient.post(BASE_URL + "/plan/verify_payment", data);

    if (r.data.success) {
      toast.success(r.data.message);
      await refreshUser();
    } else {
      toast.error(r.data.message);
    }
  };

  const subscribeFreetrial = async () => {
    if (user.value == null) {
      toast.info("Please create an account first");
      router.push("/signup");
      return;
    }
    try {
      loading.set(true);
      const { data } = await axiosClient.get(BASE_URL + "/plan/subscribe", {
        params: { plan: "freetrial" },
      });
      toast.success(data.message);
      await refreshUser();
      loading.set(false);
    } catch (e: any) {
      if (e.response.data.message) {
        toast.error(e.response.data.message);
      }
      loading.set(false);
    }
  };

  const subscribeMonthly = async () => {
    if (user.value == null) {
      toast.info("Please create an account first");
      router.push("/signup");
      return;
    }
    try {
      loading.set(true);
      const res = await loadScript(
        "https://checkout.razorpay.com/v1/checkout.js"
      );

      if (!res) {
        toast.error("Unable to load some scripts");
        return;
      }

      const { data } = await axiosClient.get(BASE_URL + "/plan/subscribe", {
        params: { plan: "monthly" },
      });

      if (data.success) {
        const options = {
          key: data.razorpay_key,
          currency: data.order.currency,
          amount: data.order.amount.toString(),
          order_id: data.order.id,
          name: "Servelogy",
          description: "Get your monthly subscription now!",
          image: "/icon.jpeg",
          handler: handlePaymentSuccess,
          prefill: {
            name: user.value.name,
            email: user.value.email,
          },
          theme: {
            color: "#000000",
          },
        };

        const window_ = window as any;
        const rzp = new window_.Razorpay(options);
        rzp.on("payment.failed", function (r: any) {
          toast.error(r.error.description);
        });
        rzp.open();
      } else {
        loading.set(false);
        toast.error(data.message);
      }
    } catch (e) {
      console.log(e);

      toast.error("An error occurred");
      loading.set(false);
    }
  };

  const subscribeYearly = async () => {
    if (user.value == null) {
      toast.info("Please create an account first");
      router.push("/signup");
      return;
    }
    try {
      loading.set(true);
      const res = await loadScript(
        "https://checkout.razorpay.com/v1/checkout.js"
      );

      if (!res) {
        toast.error("Unable to load some scripts");
        return;
      }

      const { data } = await axiosClient.get(BASE_URL + "/plan/subscribe", {
        params: { plan: "yearly" },
      });

      if (data.success) {
        const options = {
          key: data.razorpay_key,
          currency: data.order.currency,
          amount: data.order.amount.toString(),
          order_id: data.order.id,
          name: "Servelogy",
          description: "Get your yearly subscription now!",
          image: "/icon.jpeg",
          handler: handlePaymentSuccess,
          prefill: {
            name: user.value.name,
            email: user.value.email,
          },
          theme: {
            color: "#000000",
          },
        };

        const window_ = window as any;
        const rzp = new window_.Razorpay(options);
        rzp.on("payment.failed", function (r: any) {
          toast.error(r.error.description);
        });
        rzp.open();
      } else {
        loading.set(false);
        toast.error(data.message);
      }
    } catch (e) {
      console.log(e);

      toast.error("An error occurred");
      loading.set(false);
    }
  };

  return (
    <div className="text-center">
      <h1 className="text-5xl font-bold mt-8 mb-3">Choose Your Plan</h1>
      <hr />

      <div className="flex items-center justify-center flex-wrap mt-8">
        <div className="relative mx-2 min-w-[80%] sm:min-w-[50%] md:min-w-[28%] cursor-pointer shadow-2xl bg-slate-100 border-2 border-gray-300 text-black rounded-[30px] flex flex-col text-center items-center justify-center p-4 mt-8 hover:-translate-y-4 hover:bg-slate-200 duration-500">
          {user.value?.subscription?.freetrial_taken ? (
            <div className="absolute w-full h-full z-10 bg-black rounded-[30px] top-0 left-0 flex flex-col items-center justify-center">
              <span className="block bg-green-400 rounded-full px-3 py-1 uppercase border-2 border-green-500 mb-4">
                Freetrial
              </span>
              <p className="text-lg text-white">Already taken</p>
              <FaLock className="text-white text-6xl mt-2" />
            </div>
          ) : (
            <></>
          )}

          <span className="block bg-green-400 rounded-full px-3 py-1 uppercase border-2 border-green-500">
            BASIC
          </span>
          <h1 className="text-5xl font-bold mt-4">Free</h1>
          <p className="mt-1 mb-4 text-xl">7-day free trial.</p>
          <p className="text-lg my-2 font-medium">Create Unlimited Promos</p>

          <Button
            color="success"
            className="w-full text-xl px-8 py-3 mt-6 bg-green-400 z-1"
            rounded={true}
            onClick={subscribeFreetrial}
          >
            Get Started
          </Button>
        </div>

        <div className="mx-2 min-w-[80%] sm:min-w-[50%] md:min-w-[28%] cursor-pointer shadow-2xl bg-zinc-800 text-slate-100 rounded-[30px] flex flex-col text-center items-center justify-center p-4 mt-8 hover:-translate-y-4 hover:bg-zinc-900 duration-500">
          <span className="block bg-red-400 rounded-full px-3 py-1 uppercase border-2 border-red-500">
            MONTHLY
          </span>
          <h1 className="text-5xl font-bold mt-4">$9</h1>
          <p className="mt-1 mb-4 text-xl">For 1 month.</p>
          <p className="text-lg my-2 font-medium">Create Unlimited Promos</p>

          <Button
            color="error"
            className="w-full text-xl px-8 py-3 mt-6 bg-green-400 text-black"
            rounded={true}
            onClick={subscribeMonthly}
          >
            Get It Now
          </Button>
        </div>

        <div className="mx-2 min-w-[80%] sm:min-w-[50%] md:min-w-[28%] cursor-pointer shadow-2xl bg-black text-slate-100 rounded-[30px] flex flex-col text-center items-center justify-center p-4 mt-8 hover:-translate-y-4 duration-500">
          <span className="block bg-yellow-500 rounded-full px-3 py-1 uppercase border-2 border-yellow-800">
            YEARLY
          </span>
          <h1 className="text-5xl font-bold mt-4">$99</h1>
          <p className="mt-1 mb-4 text-xl">For 1 year</p>
          <p className="text-lg my-2 font-medium">Create Unlimited Promos</p>

          <Button
            color="warning"
            className="w-full text-xl px-8 py-3 mt-6 bg-green-400 text-black"
            rounded={true}
            onClick={subscribeYearly}
          >
            Get It Now
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Pricing;
