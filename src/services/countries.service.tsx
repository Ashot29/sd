import { BaseService } from "./base.service";
import { COUNTRY_URL } from "../stateManagement/url";

export default class CountryService extends BaseService {
  constructor() {
    super("countries", COUNTRY_URL);
  }

  static getInstance() {
    if (!CountryService.instance) {
        CountryService.instance = new CountryService();
    }
    return CountryService.instance;
  }

  checkEmail(email: string) {
    return fetch(`${COUNTRY_URL}/users?email=${email}`).then((resp) => resp.json());
  }

  static instance : CountryService
}
