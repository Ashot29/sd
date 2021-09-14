import React, { useState, useEffect } from "react";
import MenuButton from "./menuButton";
import "./index.css";
import { useDispatch } from "react-redux";
import MediaCard from "./card";
import CardForm from "./cardForm";
import Input from "@material-ui/core/Input";
import { useSelector } from "react-redux";
import { patchRequest } from "../../../../httpRequests/patchRequest";
import { fetchingAllLists } from "..";
import { Droppable, Draggable } from "react-beautiful-dnd";
import { DEFAULT_URL } from "../../../../stateManagement/url";

const ListItem = ({ title, id, index }) => {
  let [isClicked, setIsClicked] = useState(false);
  let [value, setValue] = useState(title);
  let cards = useSelector((state) => {
    if (state.fetchData.lists.length === 0) return [];
    if (state.fetchData.cards.length === 0) return [];
    let arr = [];
    let list = state.fetchData.lists.find((list) => list.id === id);
    let card_positions = list ? list.card_positions : [];
    let cardsArray = [
      ...state.fetchData.cards.filter((item) => item.list_id == id),
    ];
    card_positions.forEach((position) => {
      let card = cardsArray.find((item) => item.id === position);
      if (card) {
        arr.push(card);
      }
    });
    return arr;
  });

  useEffect(() => {
    fetchingAllLists(DEFAULT_URL, dispatch);
    // it is for fetching after deleting or adding card
  }, [cards.length]);

  let dispatch = useDispatch();
  let patchingNewListName = patchRequest(dispatch, "lists");

  let element = !isClicked ? (
    <div
      className="list-title"
      style={{ fontWeight: 700, fontSize: "20px", cursor: "pointer" }}
      onClick={() => setIsClicked(!isClicked)}
    >
      {title}
    </div>
  ) : (
    <form
      noValidate
      autoComplete="off"
      onSubmit={() => {
        patchingNewListName({ title: value }, id, fetchingAllLists);
        setIsClicked(!isClicked);
      }}
    >
      <Input
        value={value}
        onChange={(e) => setValue(e.target.value)}
        inputProps={{ "aria-label": "description" }}
      />
    </form>
  );

  return (
    <Draggable draggableId={id} index={index}>
      {(provided) => (
        <div
          {...provided.draggableProps}
          ref={provided.innerRef}
          className="list-item"
        >
          <div className="list-top" {...provided.dragHandleProps}>
            {element}
            <div>
              <MenuButton id={id} />
            </div>
          </div>
          <div className="button-and-cards">
            <Droppable droppableId={id} type="CARDS">
              {(provided) => (
                <div
                  className="cards-container"
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                >
                  {!!cards.length &&
                    cards.map((card, index) => {
                      return (
                        <div className="card-wrapper" key={card.id}>
                          <MediaCard
                            key={card.id}
                            id={card.id}
                            list_id={card.list_id}
                            title={card.title}
                            description={card.description}
                            index={index}
                          />
                        </div>
                      );
                    })}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
            <CardForm id={id} />
          </div>
        </div>
      )}
    </Draggable>
  );
};

export default ListItem;
