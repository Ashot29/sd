import UserService from "./../../services/user.service";

export const getUsers = () => {
  const userService = UserService.getInstance();
  return (dispatch) => {
    userService.get().then((data) => dispatch(fetchUsersSuccess(data)));
  };
};

export const fetchUsersSuccess = (users) => {
  return {
    type: "DISPATCH_USERS_TO_STORE",
    payload: {
      users,
    },
  };
};

export const deleteUser = (id) => {
  return {
    type: 'DELETE_USER',
    payload: { id }
  }
}

export const addUser = (user) => {
    return {
      type: 'ADD_USER',
      payload: { user }
    }
}
