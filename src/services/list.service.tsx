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

  static instance: ListService;
}

export interface IList {
  created_at: number
  position: number | string
  id: string
  title: string;
  updated_at?: string | number
  subscribed_to_cards: string[]
}
