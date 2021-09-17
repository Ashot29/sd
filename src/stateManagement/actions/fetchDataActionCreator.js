import { patch } from "../../httpRequests/patchRequest";
import { DEFAULT_URL } from "../url";

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

function findHighestPositionNumber(listArray) {
  let highest = listArray[0].position;
  listArray.forEach((list) => {
    if (list.position > highest) highest = list.position;
  });
  return +highest;
}

export const postLists = (title) => {
  // make more readable
  return (dispatch) => {
    fetch(`${DEFAULT_URL}/lists`)
      .then((resp) => resp.json())
      .then((lists) => {
        let position =
          lists.length === 0 ? 1 : findHighestPositionNumber(lists) + 1;

        let data = {
          id: `${Date.now()}_${Math.random()}`,
          title,
          card_positions: [],
          position,
        };

        dispatch(fetchListsRequest());

        fetch(`${DEFAULT_URL}/lists`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        })
          .then((response) => response.json())
          .then((data1) => dispatch(fetchListsSuccess([data1])));
      });
  };
};

export const addCardsActionCreator = (data) => {
  return {
    type: "ADD_CARD",
    payload: data,
  };
};

const patchCardPositions = patch('lists')

export const addCard = (inputValue, locationListId) => {
  return (dispatch) => {
    let data = {
      id: `${Date.now()}_${Math.random()}`,
      title: inputValue,
      list_id: locationListId,
      description: "",
    };
    fetch(`${DEFAULT_URL}/cards`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })
      .then((resp) => resp.json())
      .then((data) => {
        fetch(`${DEFAULT_URL}/lists/${data.list_id}`)
          .then((resp) => resp.json())
          .then((dataOfList) => {
            patchCardPositions({card_positions: [...dataOfList.card_positions, data.id]}, data.list_id)
            // patching new card positions to list with data.list_id Id
            
            .then(() => {
              fetch(`${DEFAULT_URL}/lists`)
                .then((resp) => resp.json())
                .then((data) => dispatch(setAllLists(data)));
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
