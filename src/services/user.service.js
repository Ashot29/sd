import { BaseService } from "./base.service";

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

  static instance = null;
}
