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
  const open = useSelector((state) => state.userModalReducer.modalIsOpen);
  const dispatch = useDispatch();
  const handleClose = () => dispatch(closeUserModal());

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
            <form className="user-modal-form">
              <div className="first-name-and-button">
                <TextField
                  className="firstname-input"
                  required
                  autoComplete="off"
                  id="outlined-required"
                  label="FirstName"
                  variant="outlined"
                />
                <Button onClick={handleClose}>X</Button>
              </div>
              <TextField
                required
                autoComplete="off"
                style={{ width: "100%", marginBottom: "10px" }}
                id="outlined-required"
                label="LastName"
                variant="outlined"
              />
              <TextField
                required
                autoComplete="off"
                style={{ width: "100%", marginBottom: "10px" }}
                id="outlined-required"
                label="Country"
                variant="outlined"
              />
              <TextField
                required
                autoComplete="off"
                style={{ width: "100%", marginBottom: "20px" }}
                id="outlined-required"
                label="Email"
                variant="outlined"
              />
              <TextField
                required
                autoComplete="off"
                onKeyDown={false}
                style={{ width: "20%", marginBottom: "10px" }}
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
              />
              <div className="confirm-button">
                <Button
                  variant="contained"
                  color="primary"
                  style={{ marginRight: "30px" }}
                >
                  Confirm
                </Button>
              </div>
            </form>
          </Box>
        </Fade>
      </Modal>
    </div>
  );
}
