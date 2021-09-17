import React, { useEffect, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { changeButtonState } from "../../stateManagement/actions/buttonActionCreator";
import List from "./list";
import ListForm from "./listForm";
import Button from "@material-ui/core/Button";
import { getUsers } from "../../stateManagement/actions/usersActionCreator";
import CardModal from "./cardModal";
import { Avatar } from "@material-ui/core";
import "./index.css";

function Main() {
  const users = useSelector((state) => state.usersReducer.users);
  let state = useSelector((state) => state.isButtonClicked);

  let dispatch = useDispatch();

  useEffect(() => {
    dispatch(getUsers());
  }, []);

  function changeForm() {
    dispatch(changeButtonState());
  }

  return (
    <div className="main-content">

      
      <div className="members">
        {users.map((user) => {
          return (
            <div className='member' key={user.id}>
              <h3 style={{color: '#FFF'}}>{user.firstName}</h3>
              <Avatar>{user.firstName[0]}</Avatar>
            </div>
          );
        })}
      </div>

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
