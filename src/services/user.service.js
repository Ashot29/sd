import { BaseService } from "./base.service";
import { BASE_URL } from "../stateManagement/url";

export default class UserService extends BaseService {
  constructor() {
    super("users");
  }

  static getInstance() {
    if (!UserService.instance) {
      UserService.instance = new UserService();
    }
    return UserService.instance;
  }

  checkEmail(email) {
    return fetch(`${BASE_URL}/users?email=${email}`).then((resp) => resp.json());
  }

  static instance = null;
}
