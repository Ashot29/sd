import { DEFAULT_URL } from "../stateManagement/url";

export const getRequest = (dispatch, url = DEFAULT_URL) => {
  return function (prefix, getData) {
    fetch(`${url}/${prefix}`)
      .then((resp) => resp.json())
      .then((data) => {
        dispatch(getData(data));
      });
  };
};
