import React, { useState } from "react";
import { TextField } from "@material-ui/core";
import { addCard } from "../../../../../stateManagement/actions/fetchDataActionCreator";
import { useDispatch } from "react-redux";
import Button from "@material-ui/core/Button";
import "./index.css";

function CardForm({ id }) {
  const dispatch = useDispatch();
  let [inputValue, setInputValue] = useState("");
  let [isClicked, setIsClicked] = useState(false);
  const buttonStyles = {
    marginTop: "12px",
    marginRight: "4px",
  };

  function changeForm() {
    setIsClicked(!isClicked);
  }

  function addingCard() {
    dispatch(addCard(inputValue, id));
    changeForm();
    setInputValue("");
  }

  let elem = isClicked ? (
    <form className="create-list" onSubmit={addingCard}>
      <TextField
        autoFocus
        id="standard-basic"
        label="Enter card title*"
        style={{ width: "100%" }}
        value={inputValue}
        onChange={(event) => setInputValue(event.target.value)}
      />
      <div className="form-buttons">
        <Button
          variant="contained"
          style={buttonStyles}
          color="primary"
          onClick={addingCard}
        >
          Add Card
        </Button>
        <Button style={buttonStyles} color="primary" onClick={changeForm}>
          X
        </Button>
      </div>
    </form>
  ) : (
    <Button
      variant="outlined"
      style={{ backgroundColor: "#e0e0e0" }}
      onClick={changeForm}
    >
      + ADD A CARD
    </Button>
  );

  return <div>{elem}</div>;
}

export default CardForm;
