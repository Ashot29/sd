const dataState = {
  lists: [],
  cards: [],
  isLoading: false,
}

export function fetchData(state = dataState, action) {
  switch (action.type) {
    case "FETCH_LISTS_REQUEST":
      return {
        ...state,
        isLoading: true,
      };
    case "FETCH_LISTS_SUCCESS":
      return {
        ...state,
        lists: [...state.lists, ...action.payload],
        isLoading: false,
      };
    case "FETCH_ALL_LISTS":
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
