import { useRouter } from "next/router";
import { useEffect } from "react";
import { toast } from "react-toastify";
import UserContext from "../interface/UserContext";

const AdminPage = ({
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
      } else if (!user.value.admin) {
        toast.info("Page not found");
        router.push("/");
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

export default AdminPage;
