import { ICard } from "../../services/cards.service";
import { IList } from "../../services/list.service";

export const FETCH_LISTS_REQUEST = 'FETCH_LISTS_REQUEST';
export const FETCH_LISTS_SUCCESS = 'FETCH_LISTS_SUCCESS';
export const FETCH_ALL_LISTS = 'FETCH_ALL_LISTS';
export const DELETE_CARD_FROM_LISTS_POSITIONS = 'DELETE_CARD_FROM_LISTS_POSITIONS'
export const UPDATE_LIST_CARD_POSITIONS = 'UPDATE_LIST_CARD_POSITIONS';
export const MOVE_CARD_BETWEEN_LISTS = 'MOVE_CARD_BETWEEN_LISTS';
export const ADD_CARD = 'ADD_CARD';
export const GET_ALL_CARDS = 'GET_ALL_CARDS';
export const CHANGE_CARDS_LIST_ID = 'CHANGE_CARDS_LIST_ID';

const dataState = {
  lists: [],
  cards: [],
  isLoading: false,
};

interface IDataState {
  lists: IList[]
  cards: ICard[]
  isLoading: boolean
}

export function fetchData(state: IDataState = dataState, action: any) {
  switch (action.type) {
    case FETCH_LISTS_REQUEST:
      return {
        ...state,
        isLoading: true,
      };

    case FETCH_LISTS_SUCCESS:
      return {
        ...state,
        lists: [...state.lists, action.payload],
        isLoading: false,
      };

    case FETCH_ALL_LISTS:
      return {
        ...state,
        lists: [...action.payload],
        isLoading: false,
      };

    case DELETE_CARD_FROM_LISTS_POSITIONS:
      const listsArr = state.lists.filter(list => list.id !== action.payload.list_id);
      const list = [...state.lists].find(list => list.id === action.payload.list_id);
      list?.card_positions.splice(list.card_positions.indexOf(action.payload.card_id), 1);
      return {
        ...state,
        lists: [...listsArr, list]
      }

    case UPDATE_LIST_CARD_POSITIONS:
      const user = JSON.parse(JSON.stringify([...state.lists].find((list) => list.id === action.payload.id)));
      user.card_positions = action.payload.card_positions;
      const lists = [...state.lists].filter((list) => list.id !== action.payload.id);
      return {
        ...state,
        lists: [...lists, user],
      };

    case MOVE_CARD_BETWEEN_LISTS:
      const lists_without_old_list = [...state.lists].filter(list => list.id !== action.payload.olds_id);
      const lists_without_new_list = [...lists_without_old_list].filter(list => list.id !== action.payload.news_id);
      return {
        ...state,
        lists: [...lists_without_new_list, action.payload.new_list, action.payload.old_list]
      }

    case ADD_CARD:
      return {
        ...state,
        cards: [...state.cards, action.payload],
      };

    case GET_ALL_CARDS:
      return {
        ...state,
        cards: [...action.payload],
      };

    case CHANGE_CARDS_LIST_ID:
      const cards = state.cards.filter(card => card.id !== action.payload.id)
      return {
        ...state,
        cards: [...cards, action.payload.card]
      };

    default:
      return state;
  }
}
