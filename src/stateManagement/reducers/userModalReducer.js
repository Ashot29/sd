export const userModalState = {
  userModalIsOpen: false,
  userModalMode: '',
  id: '',
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
        userModalIsOpen: false,
        userModalMode: '',
        country: "",
        firstName: "",
        lastName: "",
        age: "",
        email: "",
        id: '',
      };
    case "OPEN_USER_MODAL":
      return {
        userModalIsOpen: true,
        userModalMode: action.payload.userModalMode,
        id: action.payload.id,
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
