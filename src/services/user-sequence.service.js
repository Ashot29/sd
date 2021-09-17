import { BaseService } from "./base.service";

export default class UserSequenceService extends BaseService {
  constructor() {
    super("user-sequence");
  }

  static getInstance() {
    if (!UserSequenceService.instance) {
      UserSequenceService.instance = new UserSequenceService();
    }
    return UserSequenceService.instance;
  }

  static instance = null;
}
