import { CLOSE_USER_MODAL, OPEN_USER_MODAL } from "../reducers/userModalReducer"

export const closeUserModal = () => {
    return {
        type: CLOSE_USER_MODAL,
    }
}

export const openUserModal = (userInfo) => {
    return {
        type: OPEN_USER_MODAL,
        payload: userInfo
    }
}