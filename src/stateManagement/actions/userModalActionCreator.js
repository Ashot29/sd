export const closeUserModal = () => {
    return {
        type: "CLOSE_USER_MODAL"
    }
}

export const openUserModal = (userInfo) => {
    return {
        type: "OPEN_USER_MODAL",
        payload: userInfo
    }
}