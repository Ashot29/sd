import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { changeButtonState } from "../../stateManagement/actions/buttonActionCreator";
import List from "./list";
import { DragDropContext, Droppable } from "react-beautiful-dnd";
import ListForm from "./listForm";
import Button from "@material-ui/core/Button";
import { getUsers } from "../../stateManagement/actions/usersActionCreator";
import CardModal from "./cardModal";
import UserSequenceService from "./../../services/user-sequence.service";
import Member from "./member";
import "./index.css";

function Main() {
  const userSequenceService = UserSequenceService.getInstance();
  const dispatch = useDispatch();
  let [userSequence, setUserSequence] = useState([]);
  let state = useSelector((state) => state.isButtonClicked);

  const users = useSelector((state) => {
    const allUsers = state.usersReducer.users;
    const usersInRightArrange = [];
    userSequence.forEach((userId) =>
      usersInRightArrange.push(allUsers.find((user) => user.id === userId))
    );
    return usersInRightArrange;
  });

  useEffect(() => {
    dispatch(getUsers());
    userSequenceService
      .getById(1)
      .then((data) => setUserSequence([...data.sequence]));
  }, []);

  function changeButtonIntoForm() {
    dispatch(changeButtonState());
  }

  const dragEnd = (result) => {
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
    const userIds = users.map((user) => user.id);

    userSequenceService.update(1, { sequence: userIds });
  };

  return (
    <div className="main-content">
      <DragDropContext onDragEnd={dragEnd}>
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
                return <Member index={index} user={user} key={user.id} />;
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
          style={{backgroundColor: '#e0e0e0'}}
            className="add-list-button"
            variant="outlined"
            onClick={changeButtonIntoForm}
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
