import * as React from "react";
import Backdrop from "@material-ui/core/Backdrop";
import Box from "@material-ui/core/Box";
import Modal from "@material-ui/core/Modal";
import Fade from "@material-ui/core/Fade";
import { Button } from "@material-ui/core";
import { Typography } from "@material-ui/core";
import { TextField } from "@material-ui/core";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { closeUserModal } from "./../../../stateManagement/actions/userModalActionCreator";
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
  const open = useSelector((state) => state.userModalReducer.userModalIsOpen);
  const user = useSelector((state) => state.userModalReducer);
  const [userInfo, updateUserInfo] = React.useState({
    firstName: user.firstName,
    lastName: user.lastName,
    age: user.age,
    email: user.email,
    country: user.country,
  });
  const dispatch = useDispatch();
  const handleClose = () => dispatch(closeUserModal());

  React.useEffect(
    () => [
      updateUserInfo({
        firstName: user.firstName,
        lastName: user.lastName,
        age: user.age,
        email: user.email,
        country: user.country,
      }),
    ],
    [user]
  );

  function handleChange(event) {
    let { name, value } = event.target;
    if (!isNaN(+value)) value = +value;

    updateUserInfo((prevState) => ({
      ...prevState,
      [name]: value,
    }));
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
                event.preventDefault();
                console.log(1);
              }}
            >
              <TextField
                style={{ width: "100%", margin: "30px 0 10px" }}
                className="firstname-input"
                required
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
                style={{ width: "100%", marginBottom: "10px" }}
                id="outlined-required"
                label="Country"
                variant="outlined"
                defaultValue={user.country}
                onChange={(event) => handleChange(event)}
              />
              <TextField
                required
                name="email"
                autoComplete="off"
                style={{ width: "100%", marginBottom: "10px" }}
                id="outlined-required"
                label="Email"
                variant="outlined"
                defaultValue={user.email}
                onChange={(event) => handleChange(event)}
              />
              <TextField
                required
                name="age"
                autoComplete="off"
                style={{ width: "100%", marginBottom: "10px" }}
                inputProps={{
                  min: 18,
                  max: 100,
                  step: 1,
                  onKeyDown: (event) => {
                    event.preventDefault();
                  },
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
