import React, { useState } from "react";
import { TextField } from "@material-ui/core";
import Button from "@material-ui/core/Button";
import { fetchingAllLists } from "../..";
import "./index.css";
import { addCard } from "../../../../../stateManagement/actions/fetchDataActionCreator";
import { useDispatch } from "react-redux";
import { DEFAULT_URL } from "../../../../../stateManagement/url";

function CardForm({ id }) {
  let [inputValue, setInputValue] = useState("");
  let [isClicked, setIsClicked] = useState(false);
  let dispatch = useDispatch();
  let elem;

  let buttonStyles = {
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

  if (!isClicked) {
    elem = (
      <Button
        variant="outlined"
        style={{ backgroundColor: "#e0e0e0" }}
        onClick={changeForm}
      >
        + ADD A CARD
      </Button>
    );
  } else {
    elem = (
      <form className="create-list" onSubmit={addingCard}>
        <TextField
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
    );
  }

  return <div>{elem}</div>;
}

export default CardForm;
