export const closeModal = () => {
  return {
    type: "CLOSE_MODAL",
  };
};

export const openModal = (title, id, description, list_id) => {
  return {
    type: "OPEN_MODAL",
    payload: {
      title,
      id,
      description,
      list_id
    },
  };
};
