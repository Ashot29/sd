export const userModalState = {
    modalIsOpen: false,
  };
  
  export const userModalReducer = (state = userModalState, action) => {
    switch (action.type) {
      case "CLOSE_USER_MODAL":
        return {
          modalIsOpen: false
        };
      case "OPEN_USER_MODAL":
        return {
          modalIsOpen: true
        };
      default:
        return state;
    }
  };
  