export const userModalState = {
  userModalIsOpen: false,
  userModalMode: '',
  id: '',
  country: "",
  firstName: "",
  lastName: "",
  age: "",
  email: "",
  created_at: '',
  updated_at: '',
};

export const CLOSE_USER_MODAL = 'CLOSE_USER_MODAL';
export const OPEN_USER_MODAL = 'OPEN_USER_MODAL';

export const userModalReducer = (state = userModalState, action) => {
  switch (action.type) {
    case CLOSE_USER_MODAL:
      return {
        userModalIsOpen: false,
        userModalMode: '',
        country: "",
        firstName: "",
        lastName: "",
        age: "",
        email: "",
        id: '',
        created_at: '',
        updated_at: '',
      };
    case OPEN_USER_MODAL:
      return {
        userModalIsOpen: true,
        userModalMode: action.payload.userModalMode,
        id: action.payload.id,
        country: action.payload.country,
        firstName: action.payload.firstName,
        lastName: action.payload.lastName,
        age: action.payload.age,
        email: action.payload.email,
        created_at: action.payload.created_at,
        updated_at: action.payload.updated_at,
      };
    default:
      return state;
  }
};
