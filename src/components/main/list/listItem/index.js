import React, { useState, useEffect } from "react";
import { store } from "../../../../stateManagement/store/store";
import MenuButton from "./menuButton";
import "./index.css";
import { useDispatch } from "react-redux";
import MediaCard from "./card";
import CardForm from "./cardForm";
import Input from "@material-ui/core/Input";
import { useSelector } from "react-redux";
import { patchRequest } from "../../../../httpRequests/patchRequest";
import { fetchingAllLists } from "..";
import { Droppable } from "react-beautiful-dnd";
import CardModal from "../../cardModal";
import { DEFAULT_URL } from "../../../../stateManagement/url";

const ListItem = ({ title, id }) => {
  let [isClicked, setIsClicked] = useState(false);
  let [value, setValue] = useState(title);
  let cards = useSelector((state) => {
    if (state.fetchData.lists.length === 0) return [];
    if (state.fetchData.cards.length === 0) return [];
    let arr = [];
    let list = state.fetchData.lists.find((list) => list.id === +id);
    let card_positions = list ? list.card_positions : [];
    let cardsArray = [
      ...state.fetchData.cards.filter((item) => item.list_id == +id),
    ];
    card_positions.forEach((position) => {
      let card = cardsArray.find((item) => item.id === +position);
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
    <div className="list-item">
      <div className="list-top">
        {element}
        <div>
          <MenuButton id={id} />
        </div>
      </div>
      <div className="button-and-cards">
        <Droppable droppableId={`${id}`} type="CARDS">
          {(provided) => (
            <div
              className="cards-container"
              ref={provided.innerRef}
              {...provided.droppableProps}
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
        <CardModal />
      </div>
    </div>
  );
};

export default ListItem;

// function cardRenderingLogic(cardsArray, localCards, updateCardsArray) {
//   let arr1 = [...cardsArray];
//   let arr2 = [...localCards];
//   arr1.sort((a, b) => {
//     let fa = a.title.toLowerCase(),
//       fb = b.title.toLowerCase();

//     if (fa < fb) {
//       return -1;
//     }
//     if (fa > fb) {
//       return 1;
//     }
//     return 0;
//   });
//   arr2.sort((a, b) => {
//     let fa = a.title.toLowerCase(),
//       fb = b.title.toLowerCase();

//     if (fa < fb) {
//       return -1;
//     }
//     if (fa > fb) {
//       return 1;
//     }
//     return 0;
//   });
//   if (arr1.length !== arr2.length) {
//     updateCardsArray(arr2);
//   } else if (true) {
//     for (let i = 0; i < arr1.length; i++) {
//       if (
//         arr1[i].title !== arr2[i].title ||
//         arr1[i].description !== arr2[i].description ||
//         arr1[i].list_id !== arr2[i].list_id
//       ) {
//         updateCardsArray(arr2);
//       }
//     }
//   }
// }
