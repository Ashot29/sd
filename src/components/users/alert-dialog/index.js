import * as React from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import { useSelector } from 'react-redux';
import { closeDeleteDialog } from '../../../stateManagement/actions/deleteDialogActionCreator';
import { useDispatch } from 'react-redux';

export default function DeleteDialog() {
  const open = useSelector(state => state.deleteDialogReducer.dialogIsOpen)
  const dispatch = useDispatch();

  const handleClose = () => {
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
            By deleting this user you won't have access to his information again.
            He will be deleted from your card subscriptions too.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Disagree</Button>
          <Button onClick={handleClose} autoFocus>
            Agree
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}