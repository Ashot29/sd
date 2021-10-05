interface IDeleteDialogState {
  dialogIsOpen: boolean
  deletingUserId: string
}

export const deleteDialogState = {
  dialogIsOpen: false,
  deletingUserId: "",
};

export const CLOSE_DELETE_DIALOG = 'CLOSE_DELETE_DIALOG';
export const OPEN_DELETE_DIALOG = 'OPEN_DELETE_DIALOG'

export const deleteDialogReducer = (state: IDeleteDialogState = deleteDialogState, action: any) => {
  switch (action.type) {
    case CLOSE_DELETE_DIALOG:
      return {
        dialogIsOpen: false,
        deletingUserId: "",
      };
    case OPEN_DELETE_DIALOG:
      return {
        dialogIsOpen: true,
        deletingUserId: action.payload,
      };
    default:
      return state;
  }
};
