import { BASE_URL } from "../stateManagement/url";

export class BaseService {
  constructor(prefix, url = BASE_URL) {
    this.url = url;
    this.prefix = prefix
  }

  get() {
    return fetch(`${this.url}/${this.prefix}`).then((resp) => resp.json());
  }

  getById(id) {
    return fetch(`${this.url}/${this.prefix}/${id}`).then((resp) => resp.json());
  }

  delete(id) {
    return fetch(`${this.url}/${this.prefix}/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    }).then((resp) => resp.json());
  }

  update(id, data) {
    data.updated_at = Date.now();
    return fetch(`${this.url}/${this.prefix}/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    }).then((resp) => resp.json());
  }

  post(data) {
    data.created_at = Date.now();
    return fetch(`${this.url}/${this.prefix}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    }).then((resp) => resp.json());
  }
}
