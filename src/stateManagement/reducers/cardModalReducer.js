export const cardModalState = {
  cardModalIsOpen: false,
  modalTitle: "",
  modalId: "",
  modalDescription: "",
  modalListId: '',
};

export const CLOSE_MODAL = 'CLOSE_MODAL';
export const OPEN_MODAL = 'OPEN_MODAL'

export const cardModalReducer = (state = cardModalState, action) => {
  switch (action.type) {
    case CLOSE_MODAL:
      return {
        cardModalIsOpen: false,
        modalTitle: "",
        modalId: "",
        modalDescription: "",
        modalListId: ''
      };
    case OPEN_MODAL:
      return {
        cardModalIsOpen: true,
        modalTitle: action.payload.title,
        modalId: action.payload.id,
        modalDescription: action.payload.description,
        modalListId: action.payload.list_id
      };
    default:
      return state;
  }
};
