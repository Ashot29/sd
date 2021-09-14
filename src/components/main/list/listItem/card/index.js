import React, { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Card from "@material-ui/core/Card";
import IconButton from "@material-ui/core/IconButton";
import DeleteIcon from "@material-ui/icons/Delete";
import EditTwoToneIcon from "@material-ui/icons/EditTwoTone";
import FormatAlignLeftIcon from "@material-ui/icons/FormatAlignLeft";
import CardContent from "@material-ui/core/CardContent";
import Typography from "@material-ui/core/Typography";
import { DEFAULT_URL } from "../../../../../stateManagement/url";
import { useDispatch } from "react-redux";
import { fetchingAllCards } from "../..";
import { openModal } from "../../../../../stateManagement/actions/modalActionCreator";
import { Draggable } from "react-beautiful-dnd";
import "./index.css";

const useStyles = makeStyles({
  root: {
    maxWidth: 345,
  },
  media: {
    height: 140,
  },
});

export default function MediaCard({ title, id, description, index, list_id }) {
  let [hoverState, updateHoverState] = useState(false);
  let [isEditing, setIsEditing] = useState(false)


  let dispatch = useDispatch();
  const classes = useStyles();

  return (
    // <div className="card-wrapper" >
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
                  {(title.length <= 13 && title) || title.slice(0, 13) + "..."}
                </Typography>
                <div className="card-icons">
                  {hoverState && (
                    <IconButton className='card-edit-button' onClick={() => console.log(70)}>
                      <EditTwoToneIcon />
                    </IconButton>
                  )}
                  <IconButton aria-label="delete" className='card-delete-button'>
                    <DeleteIcon />
                  </IconButton>
                </div>
              </div>

              <div className="description-icon">
                {!!description && <FormatAlignLeftIcon fontSize="small" />}
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </Draggable>
    // </div>
  );
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
        fetch(`${DEFAULT_URL}/lists/${list_id}`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            card_positions: [...arr],
          }),
        });
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
  list_id,
) {
  if (
    !event.target.closest("button") ||
    !event.target.closest("button").classList.contains("MuiIconButton-root")
  ) {
    dispatch(openModal(title, id, description, list_id));
  } else if (event.target.closest("button").classList.contains("card-delete-button")) {
    deleteCard(url, id, dispatch, list_id);
  } else if (event.target.closest("button").classList.contains("card-edit-button")) {
    return;
  }
}
