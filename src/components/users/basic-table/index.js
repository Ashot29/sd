import React, { useEffect } from "react";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";
import { useSelector,useDispatch } from "react-redux";
import { getUsers } from "../../../stateManagement/actions/usersActionCreator";
import UserSequenceService from "./../../../services/user-sequence.service";
import { openUserModal } from "../../../stateManagement/actions/userModalActionCreator";
import UserRow from "./table-row";

export default function BasicTable() {
  const users = useSelector((state) => {
    const sortedUsers = state.usersReducer.users.sort(
      (a, b) => b.created_at - a.created_at
    );
    return sortedUsers;
  });
  const userSequenceService = UserSequenceService.getInstance();
  const handleOpen = (args) => dispatch(openUserModal(args));
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getUsers());
    userSequenceService.getById(1);
  }, []);

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
            <UserRow key={user.id} user={user} handleOpen={handleOpen} />
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
