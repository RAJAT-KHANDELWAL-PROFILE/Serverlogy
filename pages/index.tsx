import type { NextPage } from "next";
import Link from "next/link";
import { useRouter } from "next/router";
import { useContext, useEffect } from "react";
import Button from "../components/Button";
import { AppContext } from "../context/AppContext";

const Home: NextPage = () => {
  const { user } = useContext(AppContext)
  const router = useRouter()

  
  useEffect(() => {
    if (user.value) {
      router.push("/dashboard")
    }
  }, [user.value])


  return (
    <div className="flex mx-5 flex-col items-center justify-center  min-h-screen ">
      <div
        className="flex items-center justify-center lg:justify-around mx-2 text-center lg:text-left"
        style={{ minWidth: "90vw" }}
      >
        <div>
          <h1 className="text-4xl lg:text-5xl font-bold my-3 text-zinc-900">
            Create Promo for <br /> your app.
          </h1>
          <h3 className="font-600 text-xl mb-4 mt-8">Get started for free.</h3>

          <div className="flex flex-row">
            <Link href="/signup">
              <Button
                color="dark"
                rounded={true}
                className="mr-2 my-4 text-xl px-8 py-4"
              >
                Get Started
              </Button>
            </Link>
            <Link href="/login">
              <Button
                color="dark"
                outline={true}
                rounded={true}
                className="mx-2 my-4 text-xl px-8 py-4"
              >
                Login
              </Button>
            </Link>
          </div>
        </div>

        <img src="/icon.jpeg" alt="" className="hidden lg:block" />
      </div>
    </div>
  );
};

export default Home;
