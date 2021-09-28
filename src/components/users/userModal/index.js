import React, { useState, useEffect } from "react";
import Backdrop from "@material-ui/core/Backdrop";
import Box from "@material-ui/core/Box";
import Modal from "@material-ui/core/Modal";
import Fade from "@material-ui/core/Fade";
import { Button } from "@material-ui/core";
import { Typography } from "@material-ui/core";
import { TextField } from "@material-ui/core";
import Alert from "@mui/material/Alert";
import AlertTitle from "@mui/material/AlertTitle";
import { useSelector, useDispatch } from "react-redux";
import { closeUserModal } from "./../../../stateManagement/actions/userModalActionCreator";
import UserService from "../../../services/user.service";
import { addUser } from "../../../stateManagement/actions/usersActionCreator";
import { updateUser } from "../../../stateManagement/actions/usersActionCreator";
import UserSequenceService from "./../../../services/user-sequence.service";
import "./index.css";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 600,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};

export default function UserModal() {
  const userService = UserService.getInstance();
  const userSequenceService = UserSequenceService.getInstance();

  const open = useSelector((state) => state.userModalReducer.userModalIsOpen);
  const user = useSelector((state) => state.userModalReducer);
  const mode = useSelector((state) => state.userModalReducer.userModalMode);
  let [stateChanged, updateChangedState] = useState(false);
  let [emailError, setEmailError] = useState(false);

  const dispatch = useDispatch();

  const [userInfo, updateUserInfo] = useState({
    id: user.id,
    firstName: user.firstName,
    lastName: user.lastName,
    age: user.age,
    email: user.email,
    country: user.country,
    subscribed_to_cards: [],
    created_at: user.created_at,
  });

  const handleClose = () => {
    updateUserInfo({
      ...userInfo,
      id: "",
    });
    updateChangedState(false);
    setEmailError(false);
    dispatch(closeUserModal());
  };

  useEffect(
    () => [
      updateUserInfo({
        id: mode === "ADD" ? `${Date.now()}_${Math.random()}` : user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        age: user.age,
        email: user.email,
        country: user.country,
        subscribed_to_cards: [],
        created_at: user.created_at,
      }),
    ],
    [user]
  );

  function postNewUser() {
    userService.checkEmail(userInfo.email).then((data) => {
      if (!data.length) {
        userService.post(userInfo);
        userSequenceService.getById(1).then((data) => {
          const sequence = data.sequence;
          sequence.push(userInfo.id);
          userSequenceService.update(1, { sequence });
        });
        dispatch(addUser(userInfo));
        handleClose();
      } else setEmailError(true);
    });
  }

  function changeExistingUser() {
    if (!stateChanged) return;
    let updatedUser = JSON.parse(JSON.stringify(userInfo));
    delete updatedUser.subscribed_to_cards;
    userService.update(userInfo.id, updatedUser);

    dispatch(updateUser(updatedUser));
    handleClose();
  }

  function handleChange(event) {
    let { name, value } = event.target;
    if (!isNaN(+value)) value = +value;

    updateUserInfo((prevState) => ({
      ...prevState,
      [name]: value,
    }));
    updateChangedState(true);
  }

  function handleSubmit(event) {
    event.preventDefault();
    switch (mode) {
      case "ADD":
        postNewUser();
        break;
      case "EDIT":
        changeExistingUser();
        break;
      default:
        handleClose();
        break;
    }
  }

  return (
    <div>
      <Modal
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        open={open}
        onClose={handleClose}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
        }}
      >
        <Fade in={open}>
          <Box sx={style}>
            <Typography id="modal-modal-title" variant="h3" component="h2">
              User
            </Typography>
            <form
              id="user-modal-form"
              onSubmit={(event) => {
                handleSubmit(event);
              }}
            >
              <TextField
                style={{ width: "100%", margin: "30px 0 10px" }}
                className="firstname-input"
                required
                inputProps={{
                  pattern: "[a-zA-Z]{1,30}",
                }}
                name="firstName"
                autoComplete="off"
                id="outlined-required"
                label="FirstName"
                variant="outlined"
                defaultValue={user.firstName}
                onChange={(event) => handleChange(event)}
              />
              <TextField
                required
                inputProps={{
                  pattern: "[a-zA-Z]{1,30}",
                }}
                name="lastName"
                autoComplete="off"
                style={{ width: "100%", marginBottom: "10px" }}
                id="outlined-required"
                label="LastName"
                variant="outlined"
                defaultValue={user.lastName}
                onChange={(event) => handleChange(event)}
              />
              <TextField
                required
                name="country"
                autoComplete="off"
                inputProps={{
                  pattern: "[a-zA-Z]{1,30}",
                }}
                style={{ width: "100%", marginBottom: "10px" }}
                id="outlined-required"
                label="Country"
                variant="outlined"
                defaultValue={user.country}
                onChange={(event) => handleChange(event)}
              />
              <TextField
                required
                error={mode === "ADD" ? emailError : false}
                disabled={mode === "EDIT" ? true : false}
                name="email"
                autoComplete="off"
                inputProps={{
                  pattern: "[a-zA-Z0-9._%+-]+@[a-z0-9.-]+.[a-z]{2,4}$",
                }}
                style={{ width: "100%", marginBottom: "10px" }}
                id="outlined-required"
                label="Email"
                variant="outlined"
                defaultValue={user.email}
                onChange={(event) => handleChange(event)}
              />
              {!!emailError && (
                <Alert severity="error" style={{ marginBottom: "10px" }}>
                  <AlertTitle>Error</AlertTitle>
                  User with entered email already exists.
                </Alert>
              )}
              <TextField
                required
                name="age"
                autoComplete="off"
                style={{ width: "100%", marginBottom: "10px" }}
                inputProps={{
                  pattern: "[0-9]{3}",
                  min: 18,
                  max: 100,
                  step: 1,
                }}
                id="outlined-required"
                type="number"
                label="Age"
                variant="outlined"
                defaultValue={user.age}
                onChange={(event) => handleChange(event)}
              />
              <div className="confirm-button">
                <Button
                  type="submit"
                  form="user-modal-form"
                  variant="contained"
                  color="primary"
                  size="large"
                  style={{ marginRight: "30px" }}
                >
                  Confirm
                </Button>
                <Button
                  variant="outlined"
                  color="secondary"
                  size="large"
                  onClick={handleClose}
                >
                  Cancel
                </Button>
              </div>
            </form>
          </Box>
        </Fade>
      </Modal>
    </div>
  );
}
