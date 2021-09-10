import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { changeButtonState } from "../../stateManagement/actions/buttonActionCreator";
import List from "./list";
import ListForm from "./listForm";
import Button from "@material-ui/core/Button";
import { DragDropContext } from "react-beautiful-dnd";
import "./index.css";

function Main() {
  let state = useSelector((state) => state.isButtonClicked);
  let dispatch = useDispatch();

  function changeForm() {
    dispatch(changeButtonState());
  }

  return (
    
    <div className="main-content">
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
    </div>
  );
}

export default Main;