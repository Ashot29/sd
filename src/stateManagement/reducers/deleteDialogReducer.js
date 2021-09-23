export const deleteDialogState = {
    dialogIsOpen: false,
    deletingUserId: ''
  };
  
  export const deleteDialogReducer = (state = deleteDialogState, action) => {
    switch (action.type) {
      case "CLOSE_DELETE_DIALOG":
        return {
          dialogIsOpen: false,
          deletingUserId: '',
        };
      case "OPEN_DELETE_DIALOG":
        return {
          dialogIsOpen: true,
          deletingUserId: action.payload
        };
      default:
        return state;
    }
  };
  