import { Dispatch, SetStateAction } from "react"
import UserContext from "../interface/UserContext"
import UserInterface from "../interface/UserInterface"

interface AppContextInterface {
    loading: {
        value: Boolean,
        set: Dispatch<SetStateAction<Boolean>>
    }
    user: UserContext,
    refreshUser: () => Promise<void>,
}

export default AppContextInterface