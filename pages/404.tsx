import type { NextPage } from "next";
import { useRouter } from "next/router";
import Button from "../components/Button";


const Error404: NextPage = () => {
    const router = useRouter()

    return (
        <div className="min-h-[90vh] flex flex-col items-center justify-center bg-black text-white text-center">
            <h2 className="text-5xl font-bold uppercase mt-4 mb-3">Error</h2>
            <h2 className="text-8xl font-bold uppercase mt-2 mb-3">404</h2>
            <h2 className="text-xl uppercase">Page not found</h2>
            <Button color="light" onClick={() =>  router.push("/")} className="mt-10 px-5 py-3 text-xl">Go To Home</Button>
        </div>
    )
}

export default Error404