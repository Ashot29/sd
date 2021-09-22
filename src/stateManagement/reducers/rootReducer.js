import { combineReducers } from "redux";
import isButtonClicked from "./isButtonClickedReducer";
import { modalReducer } from "./modalReducer";
import { fetchData } from "./fetchDataReducer";
import { usersReducer } from "./usersReducer";

export let rootReducer = combineReducers({
  isButtonClicked,
  fetchData,
  modalReducer,
  usersReducer
});
