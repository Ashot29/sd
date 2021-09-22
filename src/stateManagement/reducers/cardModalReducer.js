export const cardModalState = {
  modalIsOpen: false,
  modalTitle: "",
  modalId: "",
  modalDescription: "",
  modalListId: '',
};

export const cardModalReducer = (state = cardModalState, action) => {
  switch (action.type) {
    case "CLOSE_MODAL":
      return {
        modalIsOpen: false,
        modalTitle: "",
        modalId: "",
        modalDescription: "",
        modalListId: ''
      };
    case "OPEN_MODAL":
      return {
        modalIsOpen: true,
        modalTitle: action.payload.title,
        modalId: action.payload.id,
        modalDescription: action.payload.description,
        modalListId: action.payload.list_id
      };
    default:
      return state;
  }
};
