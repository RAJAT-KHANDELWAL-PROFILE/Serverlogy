import { useRouter } from "next/router";
import { useEffect } from "react";
import UserContext from "../interface/UserContext";

const ProtectedPage = ({
  children,
  user,
}: {
  children: React.ReactNode;
  user: UserContext;
}) => {
  const router = useRouter();

  useEffect(() => {
    if (user.isSet) {
      if (user.value == null) {
        router.push("/login");
      } else if (!user.value.verified) {
        router.push("/verify");
      }
    }
  }, [user]);

  if (user.isSet) {
    if (user.value !== null) {
      return <>{children}</>;
    }
    return <></>;
  }

  return <></>;
};

export default ProtectedPage;
