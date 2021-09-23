export const deleteDialogState = {
    dialogIsOpen: false,
  };
  
  export const deleteDialogReducer = (state = deleteDialogState, action) => {
    switch (action.type) {
      case "CLOSE_DELETE_DIALOG":
        return {
          dialogIsOpen: false,
        };
      case "OPEN_DELETE_DIALOG":
        return {
          dialogIsOpen: true,
        };
      default:
        return state;
    }
  };
  