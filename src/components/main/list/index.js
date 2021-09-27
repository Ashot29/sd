import React, { useState, useEffect } from "react";
import ListItem from "./listItem";
import { BASE_URL } from "../../../stateManagement/url";
import { useDispatch, useSelector } from "react-redux";
import {
  setAllLists,
  getAllCards,
  changeCardsListId,
} from "../../../stateManagement/actions/fetchDataActionCreator";
import { DragDropContext, Droppable } from "react-beautiful-dnd";
import CardService from "../../../services/cards.service";
import ListService from "./../../../services/list.service";
import { updateListCardPositions } from "../../../stateManagement/actions/fetchDataActionCreator";
import { moveCardBetweenLists } from "../../../stateManagement/actions/fetchDataActionCreator";
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

function List() {
  const dispatch = useDispatch();
  let lists = useSelector((state) => state.fetchData.lists);
  let cards = useSelector((state) => state.fetchData.cards);
  let [listsArray, setListsArray] = useState([
    ...lists.sort((a, b) => a?.position - b?.position),
  ]);

  useEffect(() => {
    if (JSON.stringify(lists) !== JSON.stringify(listsArray)) {
      setListsArray(lists);
    } else return;
  }, [lists]);

  useEffect(() => {
    fetchingAllLists(dispatch);
    fetchingAllCards(BASE_URL, dispatch);
  }, []);

  const handleDragEnd = (result) => {
    const { destination, source, type, draggableId } = result;
    if (
      !destination ||
      (destination.droppableId === source.droppableId &&
        destination.index === source.index)
    ) {
      return;
    }

    if (type === "CARDS") {
      if (source.droppableId === destination.droppableId) {
        changeCardsOrder(result, dispatch, lists);
      } else {
        // changeCardsSequenceBetwLists(result, dispatch, fetchFunctions);
        changeCardsOrderBetweenLists(result, dispatch, [cards, lists])
      }
    }

    if (type === "LISTS") {
      changeListOrder([listsArray, setListsArray], result, dispatch);
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



function changeListOrder(state, result, dispatch) {
  let [listsArray, setListsArray] = state;
  const changingLists = JSON.parse(JSON.stringify(listsArray));
  const [reorderedItem] = changingLists.splice(result.source.index, 1);
  changingLists.splice(result.destination.index, 0, reorderedItem);
  changingLists.forEach((list, index) => {
    list.position = index + 1;
  });

  setListsArray(changingLists);
  dispatch(setAllLists(changingLists));

  changingLists.forEach((list) => {
    const position = list.position;
    listService.update(list.id, { position });
  });
}



function changeCardsOrder(result, dispatch, lists) {
  let { destination } = result;
  const list_id = destination.droppableId;
  const current_list = lists.find((list) => list.id === list_id);
  const card_positions = [...current_list.card_positions];

  const [reorderedItem] = card_positions.splice(result.source.index, 1);
  card_positions.splice(result.destination.index, 0, reorderedItem);

  dispatch(updateListCardPositions({ id: list_id, card_positions }));
  listService.update(list_id, { card_positions });
}



function changeCardsOrderBetweenLists(result, dispatch, cards_and_lists) {
  const { destination, source, draggableId } = result;
  const [cards, lists] = cards_and_lists
  const current_card = JSON.parse(
    JSON.stringify(cards.find((card) => card.id === draggableId))
  );
  const new_list_id = destination.droppableId;
  const old_list_id = source.droppableId;
  const new_list = lists.find((list) => list.id === new_list_id);
  const old_list = lists.find((list) => list.id === old_list_id);

  current_card.list_id = new_list_id;
  old_list.card_positions = [...old_list.card_positions].filter(
    (pos) => pos !== draggableId
  );
  new_list.card_positions.splice(destination.index, 0, draggableId);

  let new_lists = {
    olds_id: old_list_id,
    news_id: new_list_id,
    old_list: old_list,
    new_list: new_list,
  };

  dispatch(changeCardsListId({ id: draggableId, card: current_card }));
  dispatch(moveCardBetweenLists(new_lists));

  cardService.update(draggableId, current_card).then(() => {
    listService
      .update(old_list_id, old_list)
      .then(listService.update(new_list_id, new_list));
  });
}

// function makeChangesOnServerAndState(dispatch, new_lists, current_card) {
//   let {old_list_id, new_list_id, new_list, old_list} = new_lists;
//   const draggableId = current_card
//   makeChangesOnState(dispatch, draggableId, [current_card, new_lists])

//   cardService.update(draggableId, current_card).then(() => {
//     listService
//       .update(old_list_id, old_list)
//       .then(listService.update(new_list_id, new_list));
//   });
// }

// function makeChangesOnState(dispatch, id, card_and_list) {
//   let [current_card, new_lists] = card_and_list;
//   dispatch(changeCardsListId({ id, card: current_card }));
//   dispatch(moveCardBetweenLists(new_lists));
// }
