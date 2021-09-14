import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { changeButtonState } from "../../stateManagement/actions/buttonActionCreator";
import List from "./list";
import ListForm from "./listForm";
import Button from "@material-ui/core/Button";
import { getUsers } from "../../stateManagement/actions/usersActionCreator";
import CardModal from "./cardModal";
import "./index.css";

function Main() {
  let state = useSelector((state) => state.isButtonClicked);
  let dispatch = useDispatch();

  useEffect(() => {
    dispatch(getUsers())
  }, [])

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
      <CardModal />
    </div>
  );
}

export default Main;