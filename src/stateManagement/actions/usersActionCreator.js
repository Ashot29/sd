import { DEFAULT_URL } from "../url";

export const getUsers = () => {
  return (dispatch) => {
    fetch(`${DEFAULT_URL}/users`)
      .then((response) => response.json())
      .then((data) => dispatch(fetchUsersSuccess(data)));
  };
};


export const fetchUsersSuccess = (users) => {
    return {
        type: 'DISPATCH_USERS_TO_STORE',
        payload: {
            users
        }
    }
}