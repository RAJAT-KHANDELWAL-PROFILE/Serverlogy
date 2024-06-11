import Head from "next/head";
import { ToastContainer } from "react-toastify";
import { AppProvider } from "../context/AppContext";
import Loading from "./Loading";
import Navbar from "./Navbar";
import "react-toastify/dist/ReactToastify.css";
import Footer from "./Footer";

type AppProps = {
  children: React.ReactNode;
};

const Layout = ({ children }: AppProps) => {
  return (
    <AppProvider>
      <Head>
        <title>Servelogy</title>
      </Head>
      <Loading />
      <ToastContainer
        position="bottom-right"
        closeOnClick
        toastStyle={{ backgroundColor: "#000000", color: "white" }}
      />
      <Navbar />
      {children}

      <Footer />
    </AppProvider>
  );
};

export default Layout;
