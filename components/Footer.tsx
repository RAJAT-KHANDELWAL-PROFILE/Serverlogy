
const Footer = () => {

    return (
        <div className="mt-10 bg-black w-full min-h-[200px] flex flex-col items-center justify-center text-white text-xl">
            <p className="font-bold text-lg my-3">Servelogy</p>
            <p className="font-bold text-lg my-3">{(new Date()).getFullYear()} || All Rights Reserved</p>
        </div>
    )
}

export default Footer