import React, { useState } from "react";
import { TextField } from "@material-ui/core";
import { Button } from "@material-ui/core";
import CardService from "../../../../../../services/cards.service";
import { fetchingAllCards } from "../../..";
import { DEFAULT_URL } from "../../../../../../stateManagement/url";
import { useDispatch } from "react-redux";
import './index.css'

const cardService = CardService.getInstance();

let buttonStyles = {
    marginTop: "12px",
    marginRight: "4px",
  };

function EditForm(props) {
    const { updateFormState, title, id } = props;
    let [inputValue, changeInputValue] = useState(title)
    const dispatch = useDispatch();
    
    const changeCardTitle = () => {
        cardService.update(id, { title: inputValue })
        .then(() => fetchingAllCards(DEFAULT_URL, dispatch))
        updateFormState(false);
      };

  return (
      <form className="create-list" onSubmit={changeCardTitle}>
        <TextField
          autoFocus
          id="standard-basic"
          label="Change Card Title*"
          style={{ width: "100%" }}
          value={inputValue}
          onChange={(e) => changeInputValue(e.target.value)}
        />
        <div className="form-buttons">
          <Button
            variant="contained"
            style={buttonStyles}
            color="primary"
            onClick={changeCardTitle}
          >
            Change Title
          </Button>
          <Button
            style={buttonStyles}
            color="primary"
            onClick={() => updateFormState(false)}
          >
            X
          </Button>
        </div>
      </form>
  );
}

export default EditForm;
