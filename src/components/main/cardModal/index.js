import React, { useEffect, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Modal from "@material-ui/core/Modal";
import Backdrop from "@material-ui/core/Backdrop";
import Fade from "@material-ui/core/Fade";
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import { useSelector, useDispatch } from "react-redux";
import { TextField, Button } from "@material-ui/core";
import { closeModal } from "../../../stateManagement/actions/modalActionCreator";
import { DEFAULT_URL } from "../../../stateManagement/url";
import { deleteCard } from "../list/listItem/card";
import { fetchingAllCards } from "../list";
import { patchRequest } from "../../../httpRequests/patchRequest";
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

  let patchingCards = patchRequest(dispatch, "cards");

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
                  onChange={(event) => setDesc(event.target.value)}
                />
              </div>
              <div className="card-users">
                <h3 style={{ fontFamily: "roboto", marginBottom: "12px" }}>
                  Members
                </h3>
                <div className="users">
                  {users.map((user) => (
                    <div className="user" key={user.id}>
                      <FormControlLabel
                        value="end"
                        control={<Checkbox color="primary" />}
                        label={user.firstName}
                        labelPlacement="end"
                        onClick={(event) => console.log(event.target.checked)}
                      />
                    </div>
                  ))}
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
