import { FormEvent, useContext, useEffect, useState } from "react";
import { FaArrowRight } from "react-icons/fa";
import { toast } from "react-toastify";
import { AppContext } from "../../context/AppContext";
import axiosClient from "../../utils/axiosClient";
import BASE_URL from "../../utils/BaseURL";
import Button from "../../components/Button";
import SubscribedPage from "../../components/SubscribedPage";
import { useRouter } from "next/router";

const ChangeAudio = () => {
  const { user, loading } = useContext(AppContext);
  const [audio, setAudio] = useState<any>();
  const [audioName, setAudioName] = useState<string>();
  const [audioPreview, setAudioPreview] = useState<string>();
  const router = useRouter();

  useEffect(() => {
    if (user.value?.promo?.audio_url) {
      setAudioPreview(BASE_URL + user.value.promo.audio_url + "?" + Date.now());
      setAudio("DEFAULT_AUDIO_");
    }
  }, [user.value]);

  const onSelectAudio = (e: FormEvent<HTMLInputElement>) => {
    if (!e.currentTarget.files || e.currentTarget.files.length === 0) {
      setAudio(null);
      return;
    }
    setAudioPreview("");
    setAudio(e.currentTarget.files[0]);
    setAudioName(e.currentTarget.files[0].name);
  };

  const changeAudio = async () => {
    if (audio == "DEFAULT_AUDIO_") {
      router.push("/promo/create");
      return;
    }
    if (!audio || audio == "") {
      toast.error("Please select a audio");
      return;
    }
    try {
      var formData = new FormData();
      formData.append("audio", audio);

      loading.set(true);
      const { data } = await axiosClient.post(
        BASE_URL + "/promo/update_audio",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      if (data.success) {
        loading.set(false);
        toast.success(data.message);
        user.set(data.user);
        router.push("/promo/create");
      }
    } catch {
      loading.set(false);
      toast.error("An error occurred");
    }
  };

  return (
    <SubscribedPage user={user}>
      <div className="min-h-[90vh] flex flex-col items-center justify-center text-center  px-[8px]">
        <h4 className="capitalize text-4xl font-bold mb-2 text-center">
          Set your promo song
        </h4>

        <input
          onChange={onSelectAudio}
          className="hidden"
          type="file"
          id="audioInput"
          accept="audio/mp3,  audio/wav, audio/mp4, audio/m4a"
        />

        <label htmlFor="audioInput" className="box rounded-sm my-5 mx-2">
          <p className="w-[250px] py-5 px-auto mb-5 text-sm rounded-full mx-auto text-gray-500 text-center border-[1px] border-gray-500 duration-[0.5s] bg-gray100 cursor-pointer hover:bg-gray-300">
            Select A File
          </p>

          {audioPreview ? (
            <>
              <p className="text-center mt-4 mb-1 text-gray-500 text-md">
                Selected song
              </p>
              <audio controls={true}>
                <source src={audioPreview} type="audio/mp3" />
              </audio>
            </>
          ) : audio ? (
            <p className="text-center mt-4 mb-1 text-gray-500 text-md">
              Selected song:<br/>
              <span className="font-bold">{audioName}</span>
            </p>
          ) : (
            <p className="text-center mt-4 mb-1 text-gray-500 text-md">
              No song selected
            </p>
          )}
        </label>
        <Button
          color="dark"
          className="p-4 mt-3 rounded-full text-3xl"
          onClick={changeAudio}
        >
          <FaArrowRight />
        </Button>
      </div>
    </SubscribedPage>
  );
};

export default ChangeAudio;
