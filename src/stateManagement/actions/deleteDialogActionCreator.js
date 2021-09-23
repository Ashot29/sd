export const openDeleteDialog = (id) => {
    return {
        type: "OPEN_DELETE_DIALOG",
        payload: id
    }
}

export const closeDeleteDialog = () => {
    return {
        type: "CLOSE_DELETE_DIALOG"
    }
}