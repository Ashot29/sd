export const BASE_URL = "http://localhost:8000";

export class BaseService {
  constructor(url) {
    this.url = url;
  }

  get() {
    return fetch(`${BASE_URL}/${this.url}`).then((resp) => resp.json());
  }

  getById(id) {
    return fetch(`${BASE_URL}/${this.url}/${id}`).then((resp) => resp.json());
  }

  delete(id) {
    return fetch(`${BASE_URL}/${this.url}/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    }).then((resp) => resp.json());
  }

  update(id, data) {
    return fetch(`${BASE_URL}/${this.url}/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    }).then((resp) => resp.json());
  }

  post(data) {
    return fetch(`${BASE_URL}/${this.url}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    }).then((resp) => resp.json());
  }
}
