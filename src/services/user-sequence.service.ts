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

  static instance: UserSequenceService;
}

export interface UserSequenceData {
  id: Number
  sequence: string[]
  updated_at: number
}
