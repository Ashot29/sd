import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { changeButtonState } from "../../../stateManagement/actions/buttonActionCreator";
import { postLists } from "../../../stateManagement/actions/fetchDataActionCreator";
import { TextField } from "@material-ui/core";
import Button from "@material-ui/core/Button";
import "./index.css";

function ListForm() {
  const dispatch = useDispatch();
  let [inputValue, setInputValue] = useState("");
  const buttonStyles = {
    marginTop: "12px",
    marginRight: "4px",
  };

  function changeFormIntoButton() {
    dispatch(changeButtonState());
  }

  function addList() {
    dispatch(postLists(inputValue));
    setInputValue("");
  }

  return (
    <form
      className="create-list"
      onSubmit={(event) => {
        event.preventDefault();
        addList();
      }}
    >
      <TextField
        autoFocus
        id="outlined-basic"
        label="Enter list title*"
        value={inputValue}
        variant="outlined"
        onChange={(event) => setInputValue(event.target.value)}
      />
      <div className="form-buttons">
        <Button
          variant="contained"
          style={buttonStyles}
          color="primary"
          onClick={addList}
        >
          Add List
        </Button>
        <Button
          style={buttonStyles}
          color="primary"
          onClick={changeFormIntoButton}
        >
          X
        </Button>
      </div>
    </form>
  );
}

export default ListForm;
