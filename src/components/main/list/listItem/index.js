import React, { useState, useEffect } from "react";
import MenuButton from "./menuButton";
import { useDispatch, useSelector } from "react-redux";  
import MediaCard from "./card";    
import CardForm from "./cardForm";
import Input from "@material-ui/core/Input";
import { fetchingAllLists } from "..";
import { Droppable, Draggable } from "react-beautiful-dnd";
import { BASE_URL } from "../../../../stateManagement/url";
import ListService from "../../../../services/list.service";
import "./index.css";

const listService = ListService.getInstance();

const ListItem = ({ title, id, index }) => {
  let [isClicked, setIsClicked] = useState(false);
  let [value, setValue] = useState(title);
  const dispatch = useDispatch();

  const cards = useSelector((state) => {
    const lists = state.fetchData.lists;
    const cards = state.fetchData.cards;
    const cardsInRightSequence = [];
    let parentList = lists.find((list) => list.id === id);
    const card_positions = parentList ? parentList.card_positions : [];
    let cardsBelongingToThisList = [
      ...cards.filter((card) => card.list_id == id),
    ];
    card_positions.forEach((position) => {
      let card = cardsBelongingToThisList.find((card) => card.id === position);
      if (card) {
        cardsInRightSequence.push(card);
      }
    });
    return cardsInRightSequence;
  });

  // useEffect(() => {
  //   fetchingAllLists(dispatch);
  //   // it is for fetching after deleting or adding card
  // }, [cards.length]);

  let element = !isClicked ? (
    <div
      className="list-title"
      onClick={() => setIsClicked(!isClicked)}
    >
      {title}
    </div>
  ) : (
    <form
      noValidate
      autoComplete="off"
      onSubmit={() => {
        listService.update(id, { title: value })
        .then(() => fetchingAllLists(dispatch))
        setIsClicked(!isClicked);
      }}
    >
      <Input
        value={value}
        inputProps={{ "aria-label": "description" }}
        onChange={(e) => setValue(e.target.value)}
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
