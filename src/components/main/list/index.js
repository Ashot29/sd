import React, { useState, useEffect } from "react";
import ListItem from "./listItem";
import { BASE_URL } from "../../../stateManagement/url";
import { useDispatch, useSelector } from "react-redux";
import {
  setAllLists,
  getAllCards,
} from "../../../stateManagement/actions/fetchDataActionCreator";
import { DragDropContext, Droppable } from "react-beautiful-dnd";
import CardService from "../../../services/cards.service";
import ListService from "./../../../services/list.service";
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

function List() {
  const dispatch = useDispatch();
  let lists = useSelector((state) => state.fetchData.lists);
  let [listsArray, setListsArray] = useState(lists);

  useEffect(() => {
    setListsArray(lists);
  }, [lists]);

  useEffect(() => {
    fetchingAllLists(BASE_URL, dispatch);
    fetchingAllCards(BASE_URL, dispatch);
  }, []);

  const handleDragEnd = (result) => {
    const { destination, source, type } = result;
    if (
      !destination
       ||
       (destination.droppableId === source.droppableId &&
        destination.index === source.index)
    ) {
      return;
    }

    if (type === "CARDS") {
      if (source.droppableId === destination.droppableId) {
        changeSequenceOfCards(result, dispatch, fetchFunctions);
      } else {
        changeCardsSequenceBetwLists(result, dispatch, fetchFunctions);
      }
    }

    if (type === "LISTS") {
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

  listService.getById(source.droppableId).then((data) => {
    let rightArrangedArray = arrayInRightSequence(data, result);

    listService
      .update(source.droppableId, { card_positions: [...rightArrangedArray] })
      .then(() => {
        fetchingAllCards(BASE_URL, dispatch);
        fetchingAllLists(BASE_URL, dispatch);
      });
  });
}

function changeCardsSequenceBetwLists(result, dispatch, fetchFunctions) {
  const { destination, source, draggableId } = result;

  cardService
    .update(draggableId, { list_id: destination.droppableId })
    .then(() => {
      listService.getById(source.droppableId).then((data) => {
        let card_positions = [...data.card_positions];
        let index = card_positions.findIndex(
          (cardId) => cardId === draggableId
        );
        card_positions.splice(index, 1);
        listService.update(source.droppableId, { card_positions }).then(() => {
          dispatchNewCardPositions(result, dispatch, fetchFunctions);
        });
      });
    });
}

function changeListSequence(lists, result, dispatch) {
  let cloned_lists = JSON.parse(JSON.stringify(lists));
  let listArray = JSON.parse(JSON.stringify(lists));

  const [reorderedItem] = listArray.splice(result.source.index, 1);
  listArray.splice(result.destination.index, 0, reorderedItem);

  dispatch(setAllLists(listArray));

  listArray.forEach((list, index) => {
    let position = cloned_lists[index].position;
    if (list.position === position) return;

    listService.update(list.id, { position });
  });
}

function arrayInRightSequence(data, result) {
  const { destination, draggableId } = result;

  let card_positions = [...data.card_positions];
  let index = card_positions.findIndex((cardId) => cardId === draggableId);
  card_positions.splice(index, 1);
  card_positions.splice(destination.index, 0, draggableId);
  return card_positions;
}

function dispatchNewCardPositions(result, dispatch, fetchfunctions) {
  const { destination, draggableId } = result;
  const { fetchingAllCards, fetchingAllLists } = fetchfunctions;

  listService.getById(destination.droppableId).then((data) => {
    let card_positions = [...data.card_positions];
    card_positions.splice(destination.index, 0, draggableId);
    listService.update(destination.droppableId, { card_positions }).then(() => {
      fetchingAllCards(BASE_URL, dispatch);
      fetchingAllLists(BASE_URL, dispatch);
    });
  });
}
