import { BaseService } from "./base.service";

export default class CardService extends BaseService {
  constructor() {
    super("cards");
  }

  static getInstance() {
    if (!CardService.instance) {
      CardService.instance = new CardService();
    }
    return CardService.instance;
  }

  static instance = null;
}
