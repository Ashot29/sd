import React, { useEffect, useState } from "react";
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
  let state = useSelector((state) => state.modalReducer);
  const {
    modalTitle: title,
    modalId: id,
    modalDescription: description,
    modalListId: list_id
  } = state;
  const classes = useStyles();
  let [desc, setDesc] = useState(description);
  let [titleValue, setTitleValue] = useState(title);
  let dispatch = useDispatch();

  let patchingCards = patchRequest(dispatch, "cards");

  const handleClose = () => {
    dispatch(closeModal());
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
    dispatch(closeModal());
  }

  return (
    <div>
      <Modal
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        className={classes.modal}
        open={state.modalIsOpen}
        onClose={handleClose}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
        }}
      >
        <Fade in={state.modalIsOpen}>
          <div className={classes.paper}>
            <form className="card-modal-form">
              <div className="title-div">
                <TextField
                  style={{ width: "80%", marginBottom: "10px" }}
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
    </div>
  );
}
