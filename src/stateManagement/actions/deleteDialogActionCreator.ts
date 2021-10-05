import { OPEN_DELETE_DIALOG, CLOSE_DELETE_DIALOG } from "../reducers/deleteDialogReducer"

export const openDeleteDialog = (id: string) => {
    return {
        type: OPEN_DELETE_DIALOG,
        payload: id
    }
}

export const closeDeleteDialog = () => {
    return {
        type: CLOSE_DELETE_DIALOG
    }
}