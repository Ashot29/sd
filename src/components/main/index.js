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
import UserSequenceService from "./../../services/user-sequence.service";

function Main() {
  const userSequenceService = UserSequenceService.getInstance();
  let [userSequence, setUserSequence] = useState([]);
  let state = useSelector((state) => state.isButtonClicked);
  let dispatch = useDispatch();
  const patchUsersSequence = patch("user-sequence");

  const users = useSelector((state) => {
    const allUsers = state.usersReducer.users;
    const arr = [];
    userSequence.forEach((userId) =>
      arr.push(allUsers.find((user) => user.id === userId))
    );
    return arr;
  });

  useEffect(() => {
    dispatch(getUsers());
    userSequenceService
      .getById(1)
      .then((data) => setUserSequence([...data.sequence]));
  }, []);

  function changeForm() {
    dispatch(changeButtonState());
  }

  const handleUsersDrag = (result) => {
    const { destination, source } = result;
    if (
      (destination.droppableId === source.droppableId &&
        destination.index === source.index) ||
      !destination
    ) {
      return;
    }

    const [reorderedItem] = users.splice(result.source.index, 1);
    users.splice(result.destination.index, 0, reorderedItem);
    const arr = users.map((user) => user.id);
    patchUsersSequence({ sequence: arr }, 1);
  };

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
