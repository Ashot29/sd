import { ChangeEvent, SyntheticEvent, useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { makeStyles } from "@material-ui/core/styles";
import Modal from "@material-ui/core/Modal";
import Backdrop from "@material-ui/core/Backdrop";
import Fade from "@material-ui/core/Fade";
import { TextField, Button } from "@material-ui/core";
import { closeCardModal } from "../../../stateManagement/actions/cardModalActionCreator";
import { BASE_URL } from "../../../stateManagement/url";
import { deleteCard } from "../list/listItem/card";
import { fetchingAllCards } from "../list";
import { getUsers } from "../../../stateManagement/actions/usersActionCreator";
import CardService from "../../../services/cards.service";
import UserService, { IUser } from "../../../services/user.service";
import MemberCheckbox from "./memberCheckbox";
import "./index.css";
import { RootState } from "../../../stateManagement/reducers/rootReducer";

const cardService = CardService.getInstance();
const userServices = UserService.getInstance();

const useStyles = makeStyles((theme) => ({
  modal: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  paper: {
    backgroundColor: theme.palette.background.paper,
    border: "2px solid #000",
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
  },
}));

export default function CardModal() {
  const modalState = useSelector((state: RootState) => state.cardModalReducer);
  const users = useSelector((state: RootState) => state.usersReducer.users);
  const {
    modalTitle: title,
    modalId: id,
    modalDescription: description,
    modalListId: list_id,
  } = modalState;
  const classes = useStyles();
  const dispatch = useDispatch();
  let [desc, setDesc] = useState(description);
  let [titleValue, setTitleValue] = useState(title);

  useEffect(() => {
    setDesc(description);
  }, [description]);

  useEffect(() => {
    setTitleValue(title);
  }, [title]);

  const handleClose = () => {
    dispatch(closeCardModal());
    setDesc("");
  };

  function deletingCardFromModal() {
    deleteCard({id, dispatch, list_id});
    handleClose();
  }

  function saveAllChangesInModal() {
    const data = {
      title: titleValue,
      description: desc,
    };
    cardService
      .update(id, data)
      .then(() => fetchingAllCards(dispatch));
    setDesc("");
    dispatch(closeCardModal());
  }

  return (
    <Modal
      aria-labelledby="transition-modal-title"
      aria-describedby="transition-modal-description"
      className={classes.modal}
      open={modalState.cardModalIsOpen}
      onClose={handleClose}
      closeAfterTransition
      BackdropComponent={Backdrop}
      BackdropProps={{
        timeout: 500,
      }}
    >
      <Fade in={modalState.cardModalIsOpen}>
        <div className={classes.paper}>
          <form className="card-modal-form">
            <div className="title-div">
              <TextField
                className="title-textfield"
                style={{ marginBottom: "10px" }}
                required
                id="outlined-required"
                label="Title*"
                variant="outlined"
                value={titleValue}
                onChange={(event) => setTitleValue(event.target.value)}
              />
              <Button onClick={handleClose}>X</Button>
            </div>
            <div className="card-description">
              <TextField
                className="description-textfield"
                id="outlined-basic"
                label="Card Description"
                value={desc}
                variant="outlined"
                onChange={(event) => {
                  setDesc(event.target.value);
                }}
              />
            </div>
            {
            !!users.length && <div className="card-users">
              <h3 className="card-users-title">Members</h3>
              <div className="users">
                {users.map((user) => (
                  <MemberCheckbox
                    key={user.id}
                    user={user}
                    cardId={id}
                    users={users}
                    handleCheckboxClicks={handleCheckboxClicks}
                  />
                ))}
              </div>
            </div>
            }
            <div className="card-modal-buttons">
              <Button
                variant="contained"
                style={{ marginRight: "5px" }}
                color="primary"
                onClick={saveAllChangesInModal}
              >
                SAVE ALL CHANGES
              </Button>
              <Button
                variant="contained"
                color="secondary"
                onClick={deletingCardFromModal}
              >
                DELETE CARD
              </Button>
            </div>
          </form>
        </div>
      </Fade>
    </Modal>
  );
}

type HandleCheckboxClick = {
  users: IUser[]
  user: IUser
  cardId: string
}

const handleCheckboxClicks = (event: ChangeEvent<HTMLInputElement>, data: HandleCheckboxClick, dispatch: any) => {
  let { users, user, cardId } = data;

  const checked = event.target.checked;
  const current_user = users.find((currentUser) => currentUser.id === user.id);
  if (current_user === undefined) return;
  const subscribed_to_cards = new Set(current_user.subscribed_to_cards);

  let argsForHandling = {
    cardId,
    user,
    subscribed_to_cards,
    checked,
    dispatch,
  };

  if (checked) {
    changeUserSubscription("ADD", argsForHandling);
  } else {
    changeUserSubscription("DELETE", argsForHandling);
  }
};

function changeUserSubscription(type: string, args: any) {
  let { user, cardId, subscribed_to_cards, dispatch } = args;

  if (type === "DELETE") {
    subscribed_to_cards.delete(cardId);
    subscribed_to_cards = Array.from(subscribed_to_cards);
  } else if (type === "ADD") {
    subscribed_to_cards.add(cardId);
    subscribed_to_cards = Array.from(subscribed_to_cards);
  }

  userServices
    .update(user.id, { subscribed_to_cards })
    .then(() => dispatch(getUsers()));
}
