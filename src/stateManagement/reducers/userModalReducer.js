export const userModalState = {
  modalIsOpen: false,
  country: "",
  firstName: "",
  lastName: "",
  age: "",
  email: "",
};

export const userModalReducer = (state = userModalState, action) => {
  switch (action.type) {
    case "CLOSE_USER_MODAL":
      return {
        modalIsOpen: false,
        country: "",
        firstName: "",
        lastName: "",
        age: "",
        email: "",
      };
    case "OPEN_USER_MODAL":
      return {
        modalIsOpen: true,
        country: action.payload.country,
        firstName: action.payload.firstName,
        lastName: action.payload.lastName,
        age: action.payload.age,
        email: action.payload.email,
      };
    default:
      return state;
  }
};
