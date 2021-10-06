import CardService, { ICard } from "../../services/cards.service";
import ListService, { IList } from "../../services/list.service";
import {
  FETCH_LISTS_REQUEST,
  FETCH_LISTS_SUCCESS,
  FETCH_ALL_LISTS,
  DELETE_CARD_FROM_LISTS_POSITIONS,
  UPDATE_LIST_CARD_POSITIONS,
  MOVE_CARD_BETWEEN_LISTS,
  ADD_CARD,
  GET_ALL_CARDS,
  CHANGE_CARDS_LIST_ID,
} from "../reducers/fetchDataReducer";

const cardService = CardService.getInstance();
const listService = ListService.getInstance();

interface Iids_and_positions {
  id: string
  card_positions: string[]
}

interface Iids_and_lists {
  olds_id: string
    news_id: string
    old_list: IList
    new_list: IList
}

interface Ilist_and_card_ids {
  card_id: string
  list_id: string
}

interface Iid_and_card {
  id: string
  card: ICard
  // { id: draggableId, card: current_card }
}

/////////////////////////////////// Action creators for LISTS

export const fetchListsRequest = () => {
  return {
    type: FETCH_LISTS_REQUEST,
  };
};

export const fetchListsSuccess = (list: IList) => {
  return {
    type: FETCH_LISTS_SUCCESS,
    payload: list,
  };
};

export const setAllLists = (list: IList) => {
  return {
    type: FETCH_ALL_LISTS,
    payload: list,
  };
};

export const postLists = (title: string) => {
  return (dispatch: any) => {
    listService.get().then((lists) => {
      let position =
        lists.length === 0 ? 1 : findHighestPositionNumber(lists) + 1;

      let data = {
        id: `${Date.now()}_${Math.random()}`,
        title,
        card_positions: [],
        position,
      };
      dispatch(fetchListsRequest());

      listService
        .post(data)
        .then((postedData) => dispatch(fetchListsSuccess(postedData)));
    });
  };
};

export const updateListCardPositions = (id_and_positions: Iids_and_positions) => {
  return {
    type: UPDATE_LIST_CARD_POSITIONS,
    payload: id_and_positions,
  };
};

export const moveCardBetweenLists = (ids_and_lists: Iids_and_lists) => {
  return {
    type: MOVE_CARD_BETWEEN_LISTS,
    payload: ids_and_lists,
  };
};

export const deleteFromListsPositions = (list_and_card_ids: Ilist_and_card_ids) => {
  return {
    type: DELETE_CARD_FROM_LISTS_POSITIONS,
    payload: list_and_card_ids,
  };
};

///////////////////////////////// Action creators for CARDS

export const addCardsActionCreator = (data: ICard) => {
  return {
    type: ADD_CARD,
    payload: data,
  };
};

export const addCard = (inputValue: string, locationListId: string) => {
  return (dispatch: any) => {
    let data = {
      id: `${Date.now()}_${Math.random()}`,
      title: inputValue,
      list_id: locationListId,
      description: "",
    };

    cardService.post(data).then((data) => {
      listService.getById(data.list_id).then((dataOfList) => {
        listService
          .update(data.list_id, {
            card_positions: [...dataOfList.card_positions, data.id],
          })
          .then(() => {
            listService.get().then((data) => dispatch(setAllLists(data)));
          });
      });
      dispatch(addCardsActionCreator(data));
    });
  };
};

export const getAllCards = (cards: ICard[]) => {
  return {
    type: GET_ALL_CARDS,
    payload: cards,
  };
};

export const changeCardsListId = (id_and_card: Iid_and_card) => {
  return {
    type: CHANGE_CARDS_LIST_ID,
    payload: id_and_card,
  };
};

// Helper Functions

function findHighestPositionNumber(listArray: IList[]) {
  let highest = listArray[0].position;
  listArray.forEach((list) => {
    if (list.position > highest) highest = list.position;
  });
  return +highest;
}
