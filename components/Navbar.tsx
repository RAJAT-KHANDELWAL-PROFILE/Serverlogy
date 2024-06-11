import Link from "next/link";
import Button from "./Button";
import { AiOutlineMenu, AiOutlineClose, AiOutlineUser } from "react-icons/ai";
import { useContext, useState } from "react";
import { useRouter } from "next/router";
import { AppContext } from "../context/AppContext";

const Navbar = ({}: {}) => {
  const [menu, setMenu] = useState<Boolean>(false);
  const router = useRouter();
  const { user } = useContext(AppContext);

  return (
    <nav className="navbar">
      <div className="flex flex-row items-center">
        {!user.value?.subscription?.subscribed ? (
          <button onClick={() => setMenu(!menu)} className="openNav">
            <AiOutlineMenu className="text-2xl text-white ml-3" />
          </button>
        ) : (
          <></>
        )}

        <Link href={user.value ? "/dashboard" : "/"}>
          <img src="/icon.jpeg" alt="servelogy" className="icon" />
        </Link>

        {!user.value?.subscription?.subscribed ? (
          <ul className="nav-list" style={{ left: !menu ? "100%" : "0%" }}>
            <li className="closeNav">
              <button onClick={() => setMenu(!menu)}>
                <AiOutlineClose className="text-3xl text-white absolute top-0 right-0 m-5 font-bold" />
              </button>
            </li>
            <li>
              <Link href="/">
                <a onClick={() => setMenu(!menu)} className="text-lg nav-link">
                  Home
                </a>
              </Link>
            </li>
            <li>
              <a
                href="https://servelogy.com/"
                target="__blank"
                onClick={() => setMenu(!menu)}
                className="text-lg nav-link"
              >
                About
              </a>
            </li>
            <li>
              <Link href="/pricing">
                <a onClick={() => setMenu(!menu)} className="text-lg nav-link">
                  Pricing
                </a>
              </Link>
            </li>
            <li>
              <a
                href="https://servelogy.com/contact-us"
                target="__blank"
                onClick={() => setMenu(!menu)}
                className="text-lg nav-link"
              >
                Contact
              </a>
            </li>
          </ul>
        ) : (
          <></>
        )}
      </div>

      {!user.value ? (
        <div className="button-right">
          <Button
            color="light"
            className="mx-2 px-5 py-2 text-lg"
            rounded={true}
            onClick={() => router.push("/login")}
          >
            Get Started
          </Button>
        </div>
      ) : (
        <Button
          color="light"
          rounded={true}
          className="p-2 mr-5 text-3xl"
          onClick={() => router.push("/dashboard/profile")}
        >
          <AiOutlineUser />
        </Button>
      )}
    </nav>
  );
};

export default Navbar;
