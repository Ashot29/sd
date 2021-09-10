import { initialState } from "../store/initialState";

export function fetchData(state = initialState, action) {
  switch (action.type) {
    case "FETCH_USERS_REQUEST":
      return {
        ...state,
        isLoading: true,
      };
    case "FETCH_USERS_SUCCESS":
      return {
        ...state,
        lists: [...state.lists, ...action.payload],
        isLoading: false,
      };
    case "FETCH_ALL_USERS":
      return {
        ...state,
        lists: [...action.payload],
        isLoading: false,
      };
    case "ADD_CARD":
      return {
        ...state,
        cards: [...state.cards, action.payload],
      };
    case "GET_ALL_CARDS":
      return {
        ...state,
        cards: [...action.payload],
      };
    default:
      return state;
  }
}
