import { CLOSE_MODAL, OPEN_MODAL } from "../reducers/cardModalReducer";

export const closeCardModal = () => {
  return {
    type: CLOSE_MODAL,
  };
};

export const openCardModal = (title: string, id: string, description: string, list_id: string) => {
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
