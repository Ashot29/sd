import { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Card from "@material-ui/core/Card";
import IconButton from "@material-ui/core/IconButton";
import DeleteIcon from "@material-ui/icons/Delete";
import EditTwoToneIcon from "@material-ui/icons/EditTwoTone";
import FormatAlignLeftIcon from "@material-ui/icons/FormatAlignLeft";
import CardContent from "@material-ui/core/CardContent";
import Typography from "@material-ui/core/Typography";
import { BASE_URL } from "../../../../../stateManagement/url";
import { useDispatch, useSelector } from "react-redux";
import { fetchingAllCards } from "../..";
import { openCardModal } from "../../../../../stateManagement/actions/cardModalActionCreator";
import { Draggable } from "react-beautiful-dnd";
import Avatar from "@material-ui/core/Avatar";
import CardService from "../../../../../services/cards.service";
import ListService from "../../../../../services/list.service";
import EditForm from "./editForm";
import UserService from "../../../../../services/user.service";
import { deleteFromListsPositions } from '../../../../../stateManagement/actions/fetchDataActionCreator';
import "./index.css";
import { RootState } from "../../../../../stateManagement/reducers/rootReducer";
import { UserWithoutModalInfo } from "../../../../../services/user.service";

const cardService = CardService.getInstance();
const listService = ListService.getInstance();
const userService = UserService.getInstance();

const useStyles = makeStyles({
  root: {
    maxWidth: 345,
  },
  media: {
    height: 140,
  },
});

interface MediaCardProps {
  title: string
  id: string
  description: string
  index: number
  list_id: string
}

export default function MediaCard({ title, id, description, index, list_id }: MediaCardProps) {
  const classes = useStyles();
  const dispatch = useDispatch();
  let [hoverState, updateHoverState] = useState(false);
  let [formIsOpen, updateFormState] = useState(false);
  let [inputValue, changeInputValue] = useState(title);
  const usersSubscribedOnCard = useSelector((state: RootState) => {
    const allUsers = state.usersReducer.users;
    let userSet: any = new Set();
    allUsers.forEach((user) => {
      const subscribed_to_cards = new Set(user.subscribed_to_cards);
      if (subscribed_to_cards.has(id)) {
        userSet.add(user);
      }
    });
    userSet = Array.from(userSet);

    return userSet;
  });

  useEffect(() => {
    changeInputValue(title);
  }, [title]);

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
              onClick={(event) => {
                let args = {
                  event,
                  id,
                  BASE_URL,
                  dispatch,
                  title,
                  description,
                  list_id,
                };
                handlingCardClick(args);
              }}
            >
              <CardContent
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  cursor: "pointer",
                  padding: "10px"
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
                    {usersSubscribedOnCard.map((user: UserWithoutModalInfo) => {
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
    return <EditForm id={id} title={title} updateFormState={updateFormState} />;
  }
}

type DeleteCardArgs = {
  id : string
  list_id: string
  dispatch: any
}

export const deleteCard = (args: DeleteCardArgs) => {
  let { id, list_id, dispatch } = args;
  cardService
    .delete(id)
    .then(() => {
      dispatch(deleteFromListsPositions({card_id: id, list_id}))
      deleteFromlistCardPositions(args);
    })
    .then(() => deleteUserSubscription(id));
};

// Must change
function handlingCardClick(args: any) {
  let { event, id, url, dispatch, title, description, list_id } = args;
  if (
    !event.target.closest("button") ||
    !event.target.closest("button").classList.contains("MuiIconButton-root")
  ) {
    dispatch(openCardModal(title, id, description, list_id));
  } else if (
    event.target.closest("button").classList.contains("card-delete-button")
  ) {
    let argsForCardDeleting = { url, id, dispatch, list_id };
    deleteCard(argsForCardDeleting);
  } else if (
    event.target.closest("button").classList.contains("card-edit-button")
  ) {
    return;
  }
}

function deleteUserSubscription(id: string) {
  userService.get().then((data) => {
    data.forEach((user: any) => {
      const subscribed_to_cards = user.subscribed_to_cards;
      const cardIdIndex = subscribed_to_cards.findIndex(
        (cardId: string) => cardId === id
      );
      if (cardIdIndex === -1) return;
      subscribed_to_cards.splice(cardIdIndex, 1);
      userService.update(user.id, { subscribed_to_cards });
    });
  });
}

type DeleteFromlistCardPositionsArgs = {
  id: string
  list_id: string
  dispatch: any
}

function deleteFromlistCardPositions(argsForList: DeleteFromlistCardPositionsArgs) {
  let { id, list_id, dispatch } = argsForList;
  listService
    .getById(list_id)
    .then((dataOfList) => {
      const card_positions = [...dataOfList.card_positions];
      const index = card_positions.findIndex((cardId) => cardId == id);
      card_positions.splice(index, 1);
      listService.update(list_id, { card_positions });
    })
    .then(() => fetchingAllCards(dispatch));
}
