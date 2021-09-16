import React, { useEffect, useState, useRef } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Modal from "@material-ui/core/Modal";
import Backdrop from "@material-ui/core/Backdrop";
import Fade from "@material-ui/core/Fade";
import { useSelector, useDispatch } from "react-redux";
import { TextField, Button } from "@material-ui/core";
import { closeModal } from "../../../stateManagement/actions/modalActionCreator";
import { DEFAULT_URL } from "../../../stateManagement/url";
import { deleteCard } from "../list/listItem/card";
import { fetchingAllCards } from "../list";
import { patchRequest, patch } from "../../../httpRequests/patchRequest";
import { getUsers } from "../../../stateManagement/actions/usersActionCreator";
import "./index.css";

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
  const checkboxElem = useRef(null);
  const modalState = useSelector((state) => state.modalReducer);
  const users = useSelector((state) => state.usersReducer.users);
  const {
    modalTitle: title,
    modalId: id,
    modalDescription: description,
    modalListId: list_id,
  } = modalState;
  const classes = useStyles();
  let [desc, setDesc] = useState(description);
  let [titleValue, setTitleValue] = useState(title);
  let dispatch = useDispatch();

  const patchingCards = patchRequest(dispatch, "cards");
  const patchingUserSubscriptions = patch("users");

  const handleClose = () => {
    dispatch(closeModal());
    setDesc("");
  };

  useEffect(() => {
    setDesc(description);
  }, [description]);

  useEffect(() => {
    setTitleValue(title);
  }, [title]);

  function deletingCardFromModal() {
    deleteCard(DEFAULT_URL, id, dispatch, list_id);
    handleClose();
  }

  function saveAllChangesInModal() {
    let data = {
      title: titleValue,
      description: desc,
    };
    patchingCards(data, id, fetchingAllCards);
    setDesc("");
    dispatch(closeModal());
  }

  return (
    <Modal
      aria-labelledby="transition-modal-title"
      aria-describedby="transition-modal-description"
      className={classes.modal}
      open={modalState.modalIsOpen}
      onClose={handleClose}
      closeAfterTransition
      BackdropComponent={Backdrop}
      BackdropProps={{
        timeout: 500,
      }}
    >
      <Fade in={modalState.modalIsOpen}>
        <div className={classes.paper}>
          <form className="card-modal-form">
            <div className="title-div">
              <TextField
                style={{ width: "500px", marginBottom: "10px" }}
                required
                id="outlined-required"
                label="Title*"
                variant="outlined"
                value={titleValue}
                onChange={(evt) => setTitleValue(evt.target.value)}
              />
              <Button onClick={handleClose}>X</Button>
            </div>
            <div className="card-description">
              <TextField
                id="outlined-basic"
                label="Card Description"
                style={{ width: "100%" }}
                value={desc}
                variant="outlined"
                onChange={(event) => {
                  setDesc(event.target.value);
                }}
              />
            </div>
            <div className="card-users">
              <h3 style={{ fontFamily: "roboto", marginBottom: "12px" }}>
                Members
              </h3>
              <div className="users">
                {users.map((user) => {
                  let set = new Set(user.subscribed_to_cards);
                  let userHasTheId = set.has(id);
                  // Checking if user is subscribed on the card

                  return (
                    <div className="user" key={user.id}>
                      <span style={{ fontSize: "20px" }}>{user.firstName}</span>
                      <input
                        style={{ marginRight: "12px" }}
                        type="checkbox"
                        defaultChecked={userHasTheId}
                        data-cardid={id}
                        onClick={(event) => {
                          let data = { users, user, id, patchingUserSubscriptions };
                          handleCheckboxClicks(event, data, dispatch);
                        }}
                      />
                    </div>
                  );
                })}
              </div>
            </div>
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

const handleCheckboxClicks = (event, data, dispatch) => {
  let { users, user, id, patchingUserSubscriptions } = data;

  const checked = event.target.checked;
  const current_user = users.find((obj) => obj.id === user.id);
  let subscribed_to_cards = new Set(current_user.subscribed_to_cards);

  let argsForHandling = {
    id,
    user,
    patchingUserSubscriptions,
    subscribed_to_cards,
    checked,
    dispatch,
  };

  if (checked) {
    changeUserSubscription('ADD', argsForHandling, event)
  } else {
    changeUserSubscription('DELETE', argsForHandling, event)
  }
};

function changeUserSubscription(type, args, event) {
  let {
    user,
    id,
    patchingUserSubscriptions,
    subscribed_to_cards,
    checked,
    dispatch,
  } = args;

  console.log(subscribed_to_cards)

  if (type === 'DELETE') {
      subscribed_to_cards.delete(id);
      subscribed_to_cards = Array.from(subscribed_to_cards);
  } else if (type === 'ADD') {
      subscribed_to_cards.add(id);
      subscribed_to_cards = Array.from(subscribed_to_cards);
  }

  console.log(subscribed_to_cards)

  setTimeout(() => {
    if (checked !== event.target.checked) return;
    patchingUserSubscriptions({ subscribed_to_cards }, user.id)
    .then(() => dispatch(getUsers()));
  }, 300)
}
