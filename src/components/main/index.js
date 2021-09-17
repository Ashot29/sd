import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { changeButtonState } from "../../stateManagement/actions/buttonActionCreator";
import List from "./list";
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";
import ListForm from "./listForm";
import Button from "@material-ui/core/Button";
import { getUsers } from "../../stateManagement/actions/usersActionCreator";
import CardModal from "./cardModal";
import { Avatar } from "@material-ui/core";
import "./index.css";
import { DEFAULT_URL } from "../../stateManagement/url";
import { patch } from "../../httpRequests/patchRequest";

function Main() {
  let [userSequence, setUserSequence] = useState([]);

  const users = useSelector((state) => {
    let allUsers = state.usersReducer.users
    let arr = [];

    if (userSequence.length === 0) return [];
    userSequence.forEach(userId => {
      let obj = allUsers.find(user => user.id === userId)
      arr.push(obj)
    })

    return arr
  });
  let state = useSelector((state) => state.isButtonClicked);

  let dispatch = useDispatch();

  useEffect(() => {
    dispatch(getUsers());
  }, []);

  useEffect(() => {
    fetch(`${DEFAULT_URL}/user-sequence/1`)
    .then(resp => resp.json())
    .then(data => {
      setUserSequence([...data.sequence])
    })
  }, [])

  function changeForm() {
    dispatch(changeButtonState());
  }

  const patchUsersSequence = patch('user-sequence')

  const handleUsersDrag = (result) => {
    const [reorderedItem] = users.splice(result.source.index, 1);
    users.splice(result.destination.index, 0, reorderedItem);

    let arr = users.map(user => user.id)

    patchUsersSequence({sequence: arr}, 1)
    // changing the users-sequence into ours
  }

  return (
    <div className="main-content">
      <DragDropContext onDragEnd={handleUsersDrag}>
        <Droppable
          droppableId="all-members"
          direction="horizontal"
          type="MEMBERS"
        >
          {(provided) => (
            <div
              className="members"
              {...provided.droppableProps}
              ref={provided.innerRef}
            >
              {users.map((user, index) => {
                return (
                  <Draggable index={index} draggableId={user.id} key={user.id}>
                    {(provided) => (
                      <div
                        className="member"
                        {...provided.draggableProps}
                        ref={provided.innerRef}
                      >
                        <h3 style={{ color: "#FFF" }}>{user.firstName}</h3>

                        <Avatar {...provided.dragHandleProps}>
                          {user.firstName[0]}
                        </Avatar>
                        
                      </div>
                    )}
                  </Draggable>
                );
              })}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>

      <div className="lists">
        <List />
        {!state.isButtonClicked ? (
          <Button
            variant="outlined"
            style={{ backgroundColor: "#e0e0e0" }}
            onClick={changeForm}
          >
            + ADD A LIST
          </Button>
        ) : (
          <ListForm />
        )}
      </div>

      <CardModal />
    </div>
  );
}

export default Main;
