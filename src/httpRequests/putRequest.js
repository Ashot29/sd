import { DEFAULT_URL } from "../stateManagement/url";

export function putRequest(dispatch, prefix, url = DEFAULT_URL) {
  return function (data, getData, id = "") {
    fetch(`${url}/${prefix}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    }).then(() => getData(url, dispatch));
  };
}

export const put = (url, prefix) => {
  return function (data, id) {
    fetch(`${url}/${prefix}/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
  };
};
