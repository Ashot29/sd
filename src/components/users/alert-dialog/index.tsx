import * as React from "react";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import { useSelector, useDispatch } from "react-redux";
import { closeDeleteDialog } from "../../../stateManagement/actions/deleteDialogActionCreator";
import UserService from "../../../services/user.service";
import { deleteUser } from "../../../stateManagement/actions/usersActionCreator";
import UserSequenceService from "../../../services/user-sequence.service";
import { RootState } from "../../../stateManagement/reducers/rootReducer";
import { UserSequenceData } from "../../../services/user-sequence.service";

export default function DeleteDialog() {
  const open = useSelector((state: RootState) => state.deleteDialogReducer.dialogIsOpen);
  const user_id = useSelector(
    (state: RootState) => state.deleteDialogReducer.deletingUserId
  );
  const userService: any = UserService.getInstance();
  const userSequenceService: any = UserSequenceService.getInstance();
  const dispatch = useDispatch();

  const handleClose = () => {
    dispatch(closeDeleteDialog());
  };

  const deleteUserFromDialog = () => {
    userSequenceService.getById(1).then((data: UserSequenceData) => {
      const sequence = [...data.sequence];
      const index = sequence.findIndex((id: string) => id === user_id);
      if (index !== -1) {
        sequence.splice(index, 1);
        userSequenceService.update(1, { sequence });
      }
    }).then(() => userService.delete(user_id))
    dispatch(deleteUser(user_id));
    dispatch(closeDeleteDialog());
  };

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
          <Button
            variant="contained"
            color="secondary"
            onClick={deleteUserFromDialog}
            autoFocus
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}