import { DEFAULT_URL } from "../stateManagement/url";

// export const patch = (prefix, data, url = DEFAULT_URL) => {
//   fetch(`${url}/${prefix}/${id}`, {
//     method: "PATCH",
//     headers: {
//       "Content-Type": "application/json",
//     },
//     body: JSON.stringify(data),
//   })
// }

export function patchRequest(dispatch, prefix, url = DEFAULT_URL) {
  return function (data, id, getData) {
    fetch(`${url}/${prefix}/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    }).then(() => getData(url, dispatch));
  };
}
