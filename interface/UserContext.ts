import { Dispatch, SetStateAction } from "react";
import UserInterface from "./UserInterface";


interface UserContext {
    value: UserInterface | null,
    set: Dispatch<SetStateAction<UserInterface | null>>,
    isSet: Boolean
}

export default UserContext
