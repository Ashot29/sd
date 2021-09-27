import CardService from "../../services/cards.service";
import ListService from "../../services/list.service";

const cardService = CardService.getInstance();
const listService = ListService.getInstance();

/////////////////////////////////// Action creators for LISTS

export const fetchListsRequest = () => {
  return {
    type: "FETCH_LISTS_REQUEST",
  };
};

export const fetchListsSuccess = (list) => {
  return {
    type: "FETCH_LISTS_SUCCESS",
    payload: list,
  };
};

export const setAllLists = (list) => {
  return {
    type: "FETCH_ALL_LISTS",
    payload: list,
  };
};

export const postLists = (title) => {
  return (dispatch) => {
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
        .then((postedData) => dispatch(fetchListsSuccess([postedData])));
    });
  };
};

export const updateListCardPositions = (id_and_positions) => {
  return {
    type: "UPDATE_LIST_CARD_POSITIONS",
    payload: id_and_positions
  }
}

export const moveCardBetweenLists = (ids_and_lists) => {
  return {
    type: "MOVE_CARD_BETWEEN_LISTS",
    payload: ids_and_lists
  }
}

export const deleteFromListsPositions = (list_and_card_ids) => {
  return {
    type: "DELETE_CARD_FROM_LISTS_POSITIONS",
    payload: list_and_card_ids
  }
}

///////////////////////////////// Action creators for CARDS

export const addCardsActionCreator = (data) => {
  return {
    type: "ADD_CARD",
    payload: data,
  };
};

export const addCard = (inputValue, locationListId) => {
  return (dispatch) => {
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

export const getAllCards = (cards) => {
  return {
    type: "GET_ALL_CARDS",
    payload: cards,
  };
};

export const changeCardsListId = (id_and_card) => {
  return {
    type: "CHANGE_CARDS_LIST_ID",
    payload: id_and_card
  }
}

// Helper Functions

function findHighestPositionNumber(listArray) {
  let highest = listArray[0].position;
  listArray.forEach((list) => {
    if (list.position > highest) highest = list.position;
  });
  return +highest;
}