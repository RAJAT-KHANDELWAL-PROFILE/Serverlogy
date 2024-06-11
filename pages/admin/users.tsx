import { useContext, useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";
import AdminPage from "../../components/AdminPage";
import { AppContext } from "../../context/AppContext";
import axiosClient from "../../utils/axiosClient";
import BASE_URL from "../../utils/BaseURL";

interface User {
  name: string;
  email: string;
  subscribed: boolean;
  promo: {
    no_of_promo: number;
  };
}

const Users = () => {
  const { user, loading } = useContext(AppContext);

  const [users, setUsers] = useState<User[]>([]);

  const isUsersSet = useRef(true)
  
  const getUsers = async () => {
    try {
      loading.set(true);
      const { data } = await axiosClient.get(BASE_URL + "/admin/get_users");

      if (data.success) {
        setUsers(data.users);
      } else {
        toast.error(data.message);
      }
      loading.set(false);
    } catch {
      loading.set(false);
      toast.error("An error occurred");
    }
  };

  useEffect(() => {
    if (isUsersSet.current) {
        isUsersSet.current = false
        getUsers();
    }

  }, []);

  return (
    <AdminPage user={user}>
      <div className="min-h-[90vh] flex flex-col items-center justify-start text-center px-[8px] mt-6">
        <h4 className="capitalize text-4xl font-bold mb-2 text-center">
          Subscribers List
        </h4>

        <div className="overflow-x-auto relative px-2 w-[100%] mt-8">
          <table className="min-w-[100%] text-sm text-left mx-auto text-gray-500 text-center">
            <thead className="text-md text-gray-900 uppercase bg-gray-400">
              <tr>
                <th scope="col" className="py-3 px-6">
                  Name
                </th>
                <th scope="col" className="py-3 px-6">
                  Email
                </th>
                <th scope="col" className="py-3 px-6">
                  No. of promo
                </th>
              </tr>
            </thead>
            <tbody>
              {users.map((u, i) => (
                <tr key={i} className="bg-white border-b bg-gray-200">
                  <th
                    scope="row"
                    className="py-4 px-6 font-medium text-gray-700 whitespace-nowrap"
                  >
                    {u.name}
                  </th>
                  <td className="py-4 px-6">{u.email}</td>
                  <td className="py-4 px-6">{u.promo.no_of_promo}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </AdminPage>
  );
};

export default Users;
