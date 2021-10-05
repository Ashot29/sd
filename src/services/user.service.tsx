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

  checkEmail(email: string) {
    return fetch(`${BASE_URL}/users?email=${email}`).then((resp) =>
      resp.json()
    );
  }

  static instance: UserService;
}

export interface IUser {
  id: string;
  firstName: string;
  lastName: string;
  age: number;
  email: string;
  country: string;
  subscribed_to_cards: string[];
  created_at: number;
  updated_at?: number;
}
