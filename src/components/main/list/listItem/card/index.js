import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Card from "@material-ui/core/Card";
import IconButton from "@material-ui/core/IconButton";
import DeleteIcon from "@material-ui/icons/Delete";
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

export const deleteCard = (url, id, dispatch, list_id) => {
  fetch(`${url}/cards/${id}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
  })
  .then(() => {
    fetch(`${DEFAULT_URL}/lists/${list_id}`)
    .then(resp => resp.json())
    .then(dataOfList => {
      let arr = [...dataOfList.card_positions]
      let index = arr.findIndex(item => item == id)
      arr.splice(index, 1)
      fetch(`${DEFAULT_URL}/lists/${list_id}`, {
      method: 'PATCH',
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        card_positions: [...arr]
      })
    })
    })
    .then(() => fetchingAllCards(url, dispatch))
  });
};

function handlingCardClick(event, id, url, dispatch, title, description, list_id) {
  if (
    !event.target.closest("button") ||
    !event.target.closest("button").classList.contains("MuiIconButton-root")
  ) {
    dispatch(openModal(title, id, description, list_id));
  } else {
    deleteCard(url, id, dispatch, list_id);
  }
}

export default function MediaCard({ title, id, description, index, list_id }) {
  let dispatch = useDispatch();
  const classes = useStyles();

  return (
    <Draggable draggableId={`${id}`} index={index}>
      {(provided) => (
        <div 
        {...provided.draggableProps}
        {...provided.dragHandleProps}
        ref={provided.innerRef}
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
                alignItems: "center",
                justifyContent: "space-between",
                cursor: "pointer",
              }}
            >
              <Typography gutterBottom variant="h5" component="h2">
                {(title.length <= 13 && title) || title.slice(0, 13) + "..."}
              </Typography>
              <IconButton aria-label="delete">
                <DeleteIcon />
              </IconButton>
            </CardContent>
          </Card>
        </div>
      )}
    </Draggable>
  );
}
