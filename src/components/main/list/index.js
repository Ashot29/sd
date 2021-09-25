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

export const fetchingAllLists = (dispatch) => {
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
  let lists = useSelector((state) => {
    let sortedListsByPositions = state.fetchData.lists.sort((a, b) => a.position - b.position)
    return sortedListsByPositions
  });
  let [listsArray, setListsArray] = useState([...lists]);

  useEffect(() => {
    setListsArray(lists);
  }, [lists.length]);

  useEffect(() => {
    fetchingAllLists(dispatch);
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
      changeListSequence(listsArray, result, dispatch, setListsArray, lists);
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
        fetchingAllLists(dispatch);
      });
  });
}

function changeCardsSequenceBetwLists(result, dispatch, fetchFunctions) {
  const { destination, source, draggableId } = result;

  cardService
    .update(draggableId, { list_id: destination.droppableId })
    .then(() => {
      listService.getById(source.droppableId).then((data) => {
        const card_positions = [...data.card_positions];
        const index = card_positions.findIndex(
          (cardId) => cardId === draggableId
        );
        card_positions.splice(index, 1);
        listService.update(source.droppableId, { card_positions }).then(() => {
          dispatchNewCardPositions(result, dispatch, fetchFunctions);
        });
      });
    });
}

function changeListSequence(listsArray, result, dispatch, setListsArray, startingLists) {
  const cloned_lists = JSON.parse(JSON.stringify(startingLists));
  const listArray = JSON.parse(JSON.stringify(listsArray));

  const [reorderedItem] = listArray.splice(result.source.index, 1);
  listArray.splice(result.destination.index, 0, reorderedItem);

  console.log(cloned_lists, 'cloned_lists')
  console.log(listArray, 'listarray')
  setListsArray(listArray)
  dispatch(setAllLists(listArray));

  listArray.forEach((list, index) => {
    const position = cloned_lists[index].position;

    listService.update(list.id, {position});
  });
  console.log(result, 'result')
}


function arrayInRightSequence(data, result) {
  const { destination, draggableId } = result;

  const card_positions = [...data.card_positions];
  const index = card_positions.findIndex((cardId) => cardId === draggableId);
  card_positions.splice(index, 1);
  card_positions.splice(destination.index, 0, draggableId);
  return card_positions;
}


function dispatchNewCardPositions(result, dispatch, fetchfunctions) {
  const { destination, draggableId } = result;
  const { fetchingAllCards, fetchingAllLists } = fetchfunctions;

  listService.getById(destination.droppableId).then((data) => {
    const card_positions = [...data.card_positions];
    card_positions.splice(destination.index, 0, draggableId);
    listService.update(destination.droppableId, { card_positions }).then(() => {
      fetchingAllCards(BASE_URL, dispatch);
      fetchingAllLists(dispatch);
    });
  });
}
