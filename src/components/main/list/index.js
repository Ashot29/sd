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

const changingCardsListId = patch('cards')

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
    console.log(draggableId);
    if (!destination) return;
    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return;
    }

    if (source.droppableId === destination.droppableId) {
      // if the card remains in the same list
      // changeSequenceOfList(result, dispatch)
      // .then(() => console.log(1))
      fetch(`${DEFAULT_URL}/cards/${draggableId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ list_id: +destination.droppableId }),
      })
      .then(() => {
        fetch(`${DEFAULT_URL}/lists/${source.droppableId}`)
          .then((resp) => resp.json())
          .then((data) => {
            let arr = [...data.card_positions];
            let index = arr.findIndex((item) => +item === +draggableId);
            arr.splice(index, 1);
            fetch(`${DEFAULT_URL}/lists/${source.droppableId}`, {
              method: "PATCH",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                card_positions: [...arr],
              }),
            }).then(() => {
              fetch(`${DEFAULT_URL}/lists/${destination.droppableId}`)
                .then((resp) => resp.json())
                .then((data) => {
                  let arr = [...data.card_positions];
                  arr.splice(destination.index, 0, +draggableId);
                  fetch(`${DEFAULT_URL}/lists/${destination.droppableId}`, {
                    method: "PATCH",
                    headers: {
                      "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                      card_positions: [...arr],
                    }),
                  }).then(() => {
                    fetchingAllCards(DEFAULT_URL, dispatch);
                    fetchingAllLists(DEFAULT_URL, dispatch);
                  });
                });
            });
          });
      });
    }

    if (source.droppableId !== destination.droppableId) {
      fetch(`${DEFAULT_URL}/cards/${draggableId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ list_id: +destination.droppableId }),
      })
        .then((resp) => resp.json())
        .then(() => {
          fetch(`${DEFAULT_URL}/lists/${source.droppableId}`)
            .then((resp) => resp.json())
            .then((data) => {
              let arr = [...data.card_positions];
              let index = arr.findIndex((item) => +item === +draggableId);
              arr.splice(index, 1);
              fetch(`${DEFAULT_URL}/lists/${source.droppableId}`, {
                method: "PATCH",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({
                  card_positions: [...arr],
                }),
              }).then(() => {
                fetch(`${DEFAULT_URL}/lists/${destination.droppableId}`)
                  .then((resp) => resp.json())
                  .then((data) => {
                    let arr = [...data.card_positions];
                    arr.splice(destination.index, 0, +draggableId);
                    fetch(`${DEFAULT_URL}/lists/${destination.droppableId}`, {
                      method: "PATCH",
                      headers: {
                        "Content-Type": "application/json",
                      },
                      body: JSON.stringify({
                        card_positions: [...arr],
                      }),
                    }).then(() => {
                      fetchingAllCards(DEFAULT_URL, dispatch);
                      fetchingAllLists(DEFAULT_URL, dispatch);
                    });
                  });
              });
            });
        });
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

// function changeSequenceOfList(result, dispatch) {
//   const { destination, source, draggableId } = result;
//   changingCardsListId({ list_id: +destination.droppableId }, draggableId)
//     .then(() => {
//       console.log(1)
//       fetch(`${DEFAULT_URL}/lists/${source.droppableId}`)
//         .then((resp) => resp.json())
//         .then((data) => {
//           let arr = [...data.card_positions];
//           let index = arr.findIndex((item) => +item === +draggableId);
//           arr.splice(index, 1);
//           fetch(`${DEFAULT_URL}/lists/${source.droppableId}`, {
//             method: "PATCH",
//             headers: {
//               "Content-Type": "application/json",
//             },
//             body: JSON.stringify({
//               card_positions: [...arr],
//             }),
//           }).then(() => {
//             fetch(`${DEFAULT_URL}/lists/${destination.droppableId}`)
//               .then((resp) => resp.json())
//               .then((data) => {
//                 let arr = [...data.card_positions];
//                 arr.splice(destination.index, 0, +draggableId);
//                 fetch(`${DEFAULT_URL}/lists/${destination.droppableId}`, {
//                   method: "PATCH",
//                   headers: {
//                     "Content-Type": "application/json",
//                   },
//                   body: JSON.stringify({
//                     card_positions: [...arr],
//                   }),
//                 }).then(() => {
//                   fetchingAllCards(DEFAULT_URL, dispatch);
//                   fetchingAllLists(DEFAULT_URL, dispatch);
//                 });
//               });
//           });
//         });
//     });
// }
