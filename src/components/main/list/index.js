import React, { useState, useEffect } from "react";
import ListItem from "./listItem";
import { DEFAULT_URL } from "../../../stateManagement/url";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchAllUsers,
  getAllCards,
} from "../../../stateManagement/actions/fetchDataActionCreator";
import { patch } from "../../../httpRequests/patchRequest";
import { DragDropContext } from "react-beautiful-dnd";
import "./index.css";

export const fetchingAllCards = (url, dispatch) => {
  fetch(`${url}/cards`)
    .then((resp) => resp.json())
    .then((data) => {
      dispatch(getAllCards(data));
    });
};

export const fetchingAllLists = (url, dispatch) => {
  fetch(`${url}/lists`)
    .then((resp) => resp.json())
    .then((data) => {
      dispatch(fetchAllUsers(data));
    });
};

const fetchFunctions = {
  fetchingAllCards,
  fetchingAllLists,
};

const getList = (id, url = DEFAULT_URL) => {
  return fetch(`${url}/lists/${id}`)
    .then((resp) => resp.json())
    .then((data) => data);
};

const changeListCardPositions = patch("lists");
const changeCardsListId = patch("cards");

function List() {
  let lists = useSelector((state) => state.fetchData.lists);
  let [listsArray, setListsArray] = useState(lists);
  let dispatch = useDispatch();

  useEffect(() => {
    setListsArray(lists);
  }, [lists]);

  useEffect(() => {
    fetchingAllLists(DEFAULT_URL, dispatch);
    fetchingAllCards(DEFAULT_URL, dispatch);
  }, []);

  const handleDragEnd = (result) => {
    const { destination, source, draggableId } = result;
    if (!destination) return;
    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return;
    }

    if (source.droppableId === destination.droppableId) {
      // Card moves in the same list.
      changeSequenceOfList(result, dispatch, fetchFunctions);
    } else {
      changeSequenceBetweenLists(result, dispatch, fetchFunctions);
    }

    console.log(result);
  };

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <div className="list-content">
        {listsArray.map((list) => {
          return <ListItem key={list.id} id={list.id} title={list.title} />;
        })}
      </div>
    </DragDropContext>
  );
}

export default List;

function changeSequenceOfList(result, dispatch, fetchFunctions) {
  const { destination, source, draggableId } = result;
  const { fetchingAllCards, fetchingAllLists } = fetchFunctions;

  getList(source.droppableId).then((data) => {
    let arr = [...data.card_positions];
    let index = arr.findIndex((item) => +item === +draggableId);
    arr.splice(index, 1);
    arr.splice(destination.index, 0, +draggableId);
    console.log(arr, "arr");
    changeListCardPositions(
      { card_positions: [...arr] },
      source.droppableId
    ).then(() => {
      fetchingAllCards(DEFAULT_URL, dispatch);
      fetchingAllLists(DEFAULT_URL, dispatch);
    });
  });
}

function changeSequenceBetweenLists(result, dispatch, fetchFunctions) {
  const { destination, source, draggableId } = result;
  const { fetchingAllCards, fetchingAllLists } = fetchFunctions;

  changeCardsListId({ list_id: +destination.droppableId }, draggableId).then(
    () => {
      getList(source.droppableId).then((data) => {
        let arr = [...data.card_positions];
        let index = arr.findIndex((item) => +item === +draggableId);
        arr.splice(index, 1);
        changeListCardPositions(
          { card_positions: [...arr] },
          source.droppableId
        ).then(() => {
          getList(destination.droppableId).then((data) => {
            let arr = [...data.card_positions];
            arr.splice(destination.index, 0, +draggableId);
            changeListCardPositions(
              { card_positions: [...arr] },
              destination.droppableId
            ).then(() => {
              fetchingAllCards(DEFAULT_URL, dispatch);
              fetchingAllLists(DEFAULT_URL, dispatch);
            });
          });
        });
      });
    }
  );
}
