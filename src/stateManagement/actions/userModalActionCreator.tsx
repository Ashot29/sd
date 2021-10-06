import { IUser } from "../../services/user.service"
import { CLOSE_USER_MODAL, OPEN_USER_MODAL } from "../reducers/userModalReducer"

export const closeUserModal = () => {
    return {
        type: CLOSE_USER_MODAL,
    }
}

export const openUserModal = (userInfo: IUser) => {
    return {
        type: OPEN_USER_MODAL,
        payload: userInfo
    }
}