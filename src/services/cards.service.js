import { BaseService } from "./base.service";
import { BASE_URL } from "../stateManagement/url";

export default class CardService extends BaseService {
  constructor() {
    super("cards");
  }

  getWithlistId(id) {
      return fetch(`${BASE_URL}/cards?list_id=${id}`)
      .then((resp) => resp.json())
  }

  static getInstance() {
    if (!CardService.instance) {
      CardService.instance = new CardService();
    }
    return CardService.instance;
  }

  static instance = null;
}
