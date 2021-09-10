import { combineReducers } from "redux";
import isButtonClicked from "./isButtonClickedReducer";
import { modalReducer } from "./modalReducer";
import { fetchData } from "./fetchDataReducer";

export let rootReducer = combineReducers({
  isButtonClicked,
  fetchData,
  modalReducer,
});
