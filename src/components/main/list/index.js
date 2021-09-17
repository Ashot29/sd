import React, { useState, useEffect } from "react";
import ListItem from "./listItem";
import { DEFAULT_URL } from "../../../stateManagement/url";
import { useDispatch, useSelector } from "react-redux";
import {
  setAllLists,
  getAllCards,
} from "../../../stateManagement/actions/fetchDataActionCreator";
import { patch } from "../../../httpRequests/patchRequest";
import { DragDropContext, Droppable } from "react-beautiful-dnd";
import CardService from "../../../services/cards.service";
import ListService from './../../../services/list.service';
import "./index.css";

const cardService = CardService.getInstance();
const listService = ListService.getInstance();

export const fetchingAllCards = (url, dispatch) => {
  cardService.get().then((data) => dispatch(getAllCards(data)));
};

export const fetchingAllLists = (url, dispatch) => {
  listService.get().then((data) => {
    data.sort((a, b) => a.position - b.position);
    dispatch(setAllLists(data));
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
    const { destination, source, type } = result;
    if (!destination) return;
    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return;
    }

    if (type === "CARDS") {
      if (source.droppableId === destination.droppableId) {
        // Card moves in the same list.
        changeSequenceOfCards(result, dispatch, fetchFunctions);
      } else {
        // Card moves between lists
        changeCardsSequenceBetwLists(result, dispatch, fetchFunctions);
      }
    }

    if (type === "LISTS") {
      //Ete grel array ov (list-sequence: ['id2', 'id1']) aveli arag kashhxati
      changeListSequence(lists, result, dispatch);
    }
  };

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <Droppable droppableId="all-lists" direction="horizontal" type="LISTS">
        {(provided) => (
          <div
            {...provided.droppableProps}
            ref={provided.innerRef}
            className="list-content"
          >
            {listsArray.map((list, index) => {
              return (
                <ListItem
                  key={list.id}
                  id={list.id}
                  title={list.title}
                  index={index}
                />
              );
            })}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </DragDropContext>
  );
}

export default List;

function changeSequenceOfCards(result, dispatch, fetchFunctions) {
  const { source } = result;
  const { fetchingAllCards, fetchingAllLists } = fetchFunctions;

  getList(source.droppableId).then((data) => {
    let arr = arrayInRightSequence(data, result);

    changeListCardPositions(
      { card_positions: [...arr] },
      source.droppableId
    ).then(() => {
      fetchingAllCards(DEFAULT_URL, dispatch);
      fetchingAllLists(DEFAULT_URL, dispatch);
    });
  });
}

function changeCardsSequenceBetwLists(result, dispatch, fetchFunctions) {
  const { destination, source, draggableId } = result;

  changeCardsListId({ list_id: destination.droppableId }, draggableId).then(
    () => {
      getList(source.droppableId).then((data) => {
        let arr = [...data.card_positions];
        let index = arr.findIndex((item) => item === draggableId);
        arr.splice(index, 1);
        changeListCardPositions(
          { card_positions: [...arr] },
          source.droppableId
        ).then(() => {
          dispatchNewCardPositions(result, dispatch, fetchFunctions);
        });
      });
    }
  );
}

function changeListSequence(lists, result, dispatch) {
  let clone = JSON.parse(JSON.stringify(lists));
  let items = JSON.parse(JSON.stringify(lists));

  const [reorderedItem] = items.splice(result.source.index, 1);
  items.splice(result.destination.index, 0, reorderedItem);

  dispatch(setAllLists(items));

  items.forEach((item, index) => {
    let position = clone[index].position;
    if (item.position === position) return;

    fetch(`${DEFAULT_URL}/lists/${item.id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ position }),
    });
  });
}

function arrayInRightSequence(data, result) {
  const { destination, draggableId } = result;

  let arr = [...data.card_positions];
  let index = arr.findIndex((item) => item === draggableId);
  arr.splice(index, 1);
  arr.splice(destination.index, 0, draggableId);
  return arr;
}

function dispatchNewCardPositions(result, dispatch, fetchfunctions) {
  const { destination, draggableId } = result;
  const { fetchingAllCards, fetchingAllLists } = fetchfunctions;

  getList(destination.droppableId).then((data) => {
    let arr = [...data.card_positions];
    arr.splice(destination.index, 0, draggableId);
    changeListCardPositions(
      { card_positions: [...arr] },
      destination.droppableId
    ).then(() => {
      fetchingAllCards(DEFAULT_URL, dispatch);
      fetchingAllLists(DEFAULT_URL, dispatch);
    });
  });
}
