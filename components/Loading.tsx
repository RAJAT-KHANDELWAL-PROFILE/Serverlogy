import { useContext, useEffect, useState } from "react";
import LoadingBar from "react-top-loading-bar";
import { useRouter } from "next/router";
import { AppContext } from "../context/AppContext";
import styles from "../styles/Loading.module.css";

const Loading = ({}: {}) => {
  const router = useRouter();
  const [progress, setProgress] = useState(0);
  const { loading } = useContext(AppContext);

  useEffect(() => {
    const handleStart = (url: string) =>
      url !== router.asPath && setProgress(40);
    const handleComplete = (url: string) =>
      url === router.asPath && setProgress(100);

    router.events.on("routeChangeStart", handleStart);
    router.events.on("routeChangeComplete", handleComplete);
    router.events.on("routeChangeError", handleComplete);

    return () => {
      router.events.off("routeChangeStart", handleStart);
      router.events.off("routeChangeComplete", handleComplete);
      router.events.off("routeChangeError", handleComplete);
    };
  });

  return (
    <div>
      <LoadingBar
        color="#ffee00"
        progress={progress}
        height={4}
        transitionTime={100}
        onLoaderFinished={() => setProgress(0)}
      />

      {loading.value ? (
        <div className={styles.loading}>
            <div className={styles.loader}><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div></div>
        </div>
      ) : (
        <></>
      )}
    </div>
  );
};

export default Loading;
