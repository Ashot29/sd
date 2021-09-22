import { combineReducers } from "redux";
import isButtonClicked from "./isButtonClickedReducer";
import { cardModalReducer } from "./cardModalReducer";
import { fetchData } from "./fetchDataReducer";
import { usersReducer } from "./usersReducer";
import { userModalReducer } from "./userModalReducer";

export let rootReducer = combineReducers({
  isButtonClicked,
  fetchData,
  cardModalReducer,
  usersReducer,
  userModalReducer
});
