import { BaseService } from "./base.service";

export default class ListService extends BaseService {
  constructor() {
    super("lists")
  }

  static getInstance() {
    if (!ListService.instance) {
      ListService.instance = new ListService();
    }
    return ListService.instance;
  }

  static instance = null;
}
