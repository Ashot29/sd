import * as React from "react";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import { useSelector } from "react-redux";
import { closeDeleteDialog } from "../../../stateManagement/actions/deleteDialogActionCreator";
import { useDispatch } from "react-redux";
import UserService from './../../../services/user.service';
import { deleteUser } from "../../../stateManagement/actions/usersActionCreator";
import UserSequenceService from "../../../services/user-sequence.service";

export default function DeleteDialog() {
  const open = useSelector((state) => state.deleteDialogReducer.dialogIsOpen);
  const user_id = useSelector((state) => state.deleteDialogReducer.deletingUserId)
  const userService = UserService.getInstance();
  const userSequenceService = UserSequenceService.getInstance();
  const dispatch = useDispatch();

  const handleClose = () => {
    dispatch(closeDeleteDialog());
  };

  const deleteUserFromDialog = () => {
    userSequenceService.getById(1)
    .then(data => {
      const sequence = data.sequence;
      const index = sequence.findIndex(id => id === user_id);
      sequence.splice(index, 1);
      userSequenceService.update(1, {sequence});
    })
    userService.delete(user_id);
    dispatch(deleteUser(user_id));
    dispatch(closeDeleteDialog());
  }

  return (
    <div>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {"Do you really want to delete this user?"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            By deleting this user you won't have access to his information ever
            again. He will be deleted from your card subscriptions too.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button variant="outlined" color="primary" onClick={handleClose}>
            Cancel
          </Button>
          <Button variant='contained' color="secondary" onClick={deleteUserFromDialog} autoFocus>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}


// {
//   "id": "08715_0.5828",
//   "firstName": "Ann",
//   "lastName": "Smith",
//   "country": "Australia",
//   "age": 34,
//   "email": "ann@codingthesmartway.com",
//   "subscribed_to_cards": []
// }