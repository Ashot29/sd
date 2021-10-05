import { BaseService } from "./base.service";
import { BASE_URL } from "../stateManagement/url";

export default class CardService extends BaseService {
  id: any;
  constructor() {
    super("cards");
  }

  getWithlistId(id: string) {
    return fetch(`${BASE_URL}/cards?list_id=${id}`).then((resp) => resp.json());
  }

  static getInstance() {
    if (!CardService.instance) {
      CardService.instance = new CardService();
    }
    return CardService.instance;
  }

  static instance: CardService;
}

export interface ICard {
  created_at: number
  description: string
  id: string
  list_id: string
  title: string
  updated_at?: number
}
