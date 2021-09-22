import React from "react";
import BasicTable from "./basic-table";
import AddIcon from "@material-ui/icons/Add";
import { Button } from "@material-ui/core";
import UserModal from "./userModal";
import { openUserModal } from "../../stateManagement/actions/userModalActionCreator";
import { useDispatch } from 'react-redux';
import "./index.css";

const Users = () => {
  const dispatch = useDispatch();
  const handleOpen = () => dispatch(openUserModal())

  return (
    <div className="users-section">
      <BasicTable />
      <div className="user-add-button">
        <Button
          variant="contained"
          color="primary"
          size="large"
          startIcon={<AddIcon />}
          style={{ marginTop: "10px" }}
          onClick={handleOpen}
        >
          Add new users
        </Button>
      </div>
      <UserModal />
    </div>
  );
};

export default Users;
