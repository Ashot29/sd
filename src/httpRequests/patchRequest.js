import { DEFAULT_URL } from "../stateManagement/url";

export function patchRequest(dispatch, prefix, url = DEFAULT_URL) {
  return function (data, id, getData) {
    return fetch(`${url}/${prefix}/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    }).then(() => getData(url, dispatch));
  };
}

export function patch(prefix, url = DEFAULT_URL) {
  return function (data, id = '') {
    return fetch(`${url}/${prefix}/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    }).then(resp => resp.json())
  };
}