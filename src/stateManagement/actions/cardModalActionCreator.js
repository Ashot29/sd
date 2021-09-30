import { CLOSE_MODAL, OPEN_MODAL } from "../reducers/cardModalReducer";

export const closeCardModal = () => {
  return {
    type: CLOSE_MODAL,
  };
};

export const openCardModal = (title, id, description, list_id) => {
  return {
    type: OPEN_MODAL,
    payload: {
      title,
      id,
      description,
      list_id,
    },
  };
};
