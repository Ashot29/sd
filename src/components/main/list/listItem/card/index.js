import React, { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Card from "@material-ui/core/Card";
import IconButton from "@material-ui/core/IconButton";
import DeleteIcon from "@material-ui/icons/Delete";
import EditTwoToneIcon from "@material-ui/icons/EditTwoTone";
import { TextField } from "@material-ui/core";
import Button from "@material-ui/core/Button";
import FormatAlignLeftIcon from "@material-ui/icons/FormatAlignLeft";
import CardContent from "@material-ui/core/CardContent";
import Typography from "@material-ui/core/Typography";
import { DEFAULT_URL } from "../../../../../stateManagement/url";
import { useDispatch, useSelector } from "react-redux";
import { fetchingAllCards } from "../..";
import { patch } from "../../../../../httpRequests/patchRequest";
import { openModal } from "../../../../../stateManagement/actions/modalActionCreator";
import { Draggable } from "react-beautiful-dnd";
import Avatar from "@material-ui/core/Avatar";
import "./index.css";

const useStyles = makeStyles({
  root: {
    maxWidth: 345,
  },
  media: {
    height: 140,
  },
});

const patchCardTitle = patch("cards");
const patchListCardPositions = patch("lists");

export default function MediaCard({ title, id, description, index, list_id }) {
  const usersSubscribedOnCard = useSelector((state) => {
    // Taking only the users that are subscribed to this card
    let allUsers = state.usersReducer.users;
    let set = new Set();

    allUsers.forEach((user) => {
      const subscribed_to_cards = new Set(user.subscribed_to_cards);
      if (subscribed_to_cards.has(id)) {
        set.add(user);
      }
    });

    set = Array.from(set);

    return set;
  });

  let [hoverState, updateHoverState] = useState(false);
  let [formIsOpen, updateFormState] = useState(false);
  let [inputValue, changeInputValue] = useState(title);
  // this component renders either card or card editing form

  useEffect(() => {
    changeInputValue(title);
  }, [title]);

  let dispatch = useDispatch();
  const classes = useStyles();

  let buttonStyles = {
    marginTop: "12px",
    marginRight: "4px",
  };

  const changeCardTitle = () => {
    patchCardTitle({ title: inputValue }, id);
    updateFormState(false);
  };

  if (!formIsOpen) {
    return (
      <Draggable draggableId={id} index={index}>
        {(provided) => (
          <div
            {...provided.draggableProps}
            {...provided.dragHandleProps}
            ref={provided.innerRef}
            onMouseEnter={() => updateHoverState(true)}
            onMouseLeave={() => updateHoverState(false)}
          >
            <Card
              className={classes.root}
              style={{ marginTop: "15px", marginBottom: "15px" }}
              onClick={(event) =>
                handlingCardClick(
                  event,
                  id,
                  DEFAULT_URL,
                  dispatch,
                  title,
                  description,
                  list_id
                )
              }
            >
              <CardContent
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  cursor: "pointer",
                }}
              >
                <div className="card-title-and-delete">
                  <Typography gutterBottom variant="h5" component="h2">
                    {(inputValue.length <= 13 && inputValue) ||
                      inputValue.slice(0, 13) + "..."}
                  </Typography>
                  <div className="card-icons">
                    {hoverState && (
                      <IconButton
                        className="card-edit-button"
                        onClick={() => updateFormState(true)}
                      >
                        <EditTwoToneIcon />
                      </IconButton>
                    )}
                    <IconButton
                      aria-label="delete"
                      className="card-delete-button"
                    >
                      <DeleteIcon />
                    </IconButton>
                  </div>
                </div>

                <div className="card-bottom">
                  <div className="description-icon">
                    {!!description && <FormatAlignLeftIcon fontSize="small" />}
                  </div>
                  <div className="card-avatars">
                    {usersSubscribedOnCard.map((user) => {
                      return (
                        <Avatar
                          key={user.id}
                          style={{
                            marginLeft: "5px",
                            backgroundColor: "#c7d1c8",
                          }}
                        >
                          {user.firstName[0]}
                        </Avatar>
                      );
                    })}
                  </div>
                </div>
                
              </CardContent>
            </Card>
          </div>
        )}
      </Draggable>
    );
  } else {
    return (
      <form className="create-list" onSubmit={changeCardTitle}>
        <TextField
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
}

export const deleteCard = (url, id, dispatch, list_id) => {
  fetch(`${url}/cards/${id}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
  }).then(() => {
    fetch(`${DEFAULT_URL}/lists/${list_id}`)
      .then((resp) => resp.json())
      .then((dataOfList) => {
        let arr = [...dataOfList.card_positions];
        let index = arr.findIndex((item) => item == id);
        arr.splice(index, 1);

        // deleting card id from list's card_positions
        patchListCardPositions({ card_positions: [...arr] }, list_id);
      })
      .then(() => fetchingAllCards(url, dispatch));
  });
};

function handlingCardClick(
  event,
  id,
  url,
  dispatch,
  title,
  description,
  list_id
) {
  if (
    !event.target.closest("button") ||
    !event.target.closest("button").classList.contains("MuiIconButton-root")
  ) {
    dispatch(openModal(title, id, description, list_id));
  } else if (
    event.target.closest("button").classList.contains("card-delete-button")
  ) {
    deleteCard(url, id, dispatch, list_id);
  } else if (
    event.target.closest("button").classList.contains("card-edit-button")
  ) {
    return;
  }
}
