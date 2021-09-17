import { DEFAULT_URL } from "../url";
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
