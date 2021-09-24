import React, {useEffect} from "react";
import { useSelector } from "react-redux";
import BasicTable from "./basic-table";
import AddIcon from "@material-ui/icons/Add";
import { Button } from "@material-ui/core";
import UserModal from "./userModal";
import { openUserModal } from "../../stateManagement/actions/userModalActionCreator";
import { useDispatch } from "react-redux";
import DeleteDialog from "./alert-dialog";
import { getUsers } from "../../stateManagement/actions/usersActionCreator";
import "./index.css";

const Users = () => {
  const users = useSelector((state) => state.usersReducer.users);
  const dispatch = useDispatch();
  const data = {
    userModalIsOpen: true,
    userModalMode: 'ADD',
    country: "",
    firstName: "",
    lastName: "",
    age: "",
    email: "",
  };

  useEffect(() => {
    dispatch(getUsers());
  }, [])

  const handleOpen = () => {
    dispatch(openUserModal(data))
  };

  return (
    <div className="users-section">
      <div className="user-add-button">
        <Button
          variant="contained"
          color="primary"
          size="large"
          startIcon={<AddIcon />}
          style={{ marginBottom: "10px" }}
          onClick={handleOpen}
        >
          Add new users
        </Button>
      </div>
      {!!users.length && <BasicTable />}
      <UserModal />
      <DeleteDialog />
    </div>
  );
};

export default Users;
