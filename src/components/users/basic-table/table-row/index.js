import React from "react";
import TableRow from "@material-ui/core/TableRow";
import TableCell from "@material-ui/core/TableCell";
import { Button } from "@material-ui/core";
import DeleteIcon from "@material-ui/icons/Delete";
import EditIcon from "@material-ui/icons/Edit";
import { useDispatch } from 'react-redux';
import { openDeleteDialog } from "../../../../stateManagement/actions/deleteDialogActionCreator";

const UserRow = ({user, handleDeleteEvent, handleOpen}) => {
  const dispatch = useDispatch()

  function handleDeleteEvent(userId) {
    dispatch(openDeleteDialog(userId))
  }

  return (
    <>
      <TableRow
        key={user.id}
        data-id={user.id}
        sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
      >
        <TableCell component="th" scope="row" align="center">
          {user.firstName + " " + user.lastName[0] + "."}
        </TableCell>
        <TableCell align="center">{user.country}</TableCell>
        <TableCell align="center">{user.age}</TableCell>
        <TableCell align="center">{user.email}</TableCell>
        <TableCell align="center">
          <Button
            data-id={user.id}
            variant="contained"
            color="primary"
            startIcon={<EditIcon />}
            style={{ marginRight: "10px" }}
            onClick={() => {
              handleOpen(user);
            }}
          >
            Edit
          </Button>
          <Button
            data-id={user.id}
            variant="outlined"
            color="secondary"
            startIcon={<DeleteIcon />}
            onClick={() => {
              handleDeleteEvent(user.id);
            }}
          >
            Delete
          </Button>
        </TableCell>
      </TableRow>
    </>
  );
};

export default UserRow;
