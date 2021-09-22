import React, { useEffect } from "react";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { getUsers } from "../../../stateManagement/actions/usersActionCreator";
import { Button } from "@material-ui/core";
import DeleteIcon from "@material-ui/icons/Delete";
import EditIcon from "@material-ui/icons/Edit";
import UserSequenceService from "./../../../services/user-sequence.service";
import { openUserModal } from "../../../stateManagement/actions/userModalActionCreator";

export default function BasicTable() {
  const users = useSelector((state) => state.usersReducer.users);
  const dispatch = useDispatch();
  const userSequenceService = UserSequenceService.getInstance();
  const handleOpen = () => dispatch(openUserModal());

  useEffect(() => {
    dispatch(getUsers());
    userSequenceService.getById(1);
  }, []);

  function handleDeleteEvent() {
    let confirmation = window.confirm('are you sure')
    console.log(confirmation)
  }

  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell align="center">FullName</TableCell>
            <TableCell align="center">Country</TableCell>
            <TableCell align="center">Age</TableCell>
            <TableCell align="center">Email</TableCell>
            <TableCell align="center">Change Info</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {users.map((user) => (
            //arandzin omponent
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
                  onClick={handleOpen}
                >
                  Edit
                </Button>
                <Button
                  data-id={user.id}
                  variant="outlined"
                  color="secondary"
                  startIcon={<DeleteIcon />}
                  onClick={() => {
                    handleDeleteEvent()
                  }}
                >
                  Delete
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
