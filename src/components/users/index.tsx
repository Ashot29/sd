import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import BasicTable from "./basic-table";
import AddIcon from "@material-ui/icons/Add";
import { Button } from "@material-ui/core";
import UserModal from "./userModal";
import { openUserModal } from "../../stateManagement/actions/userModalActionCreator";
import { useDispatch } from "react-redux";
import DeleteDialog from "./alert-dialog";
import { getUsers } from "../../stateManagement/actions/usersActionCreator";
import { RootState } from "../../stateManagement/reducers/rootReducer";
import { IUser } from "../../services/user.service";
import "./index.css";

// interface UserModalData {
//   userModalIsOpen: boolean;
//   userModalMode: string;
//   country: string;
//   firstName: string;
//   lastName: string;
//   age: string | number;
//   email: string;
// }

const Users: React.FC = () => {
  const users = useSelector((state: RootState) => state.usersReducer.users);
  const dispatch = useDispatch();
  const data: IUser = {
    userModalIsOpen: true,
    userModalMode: "ADD",
    id: "",
    country: "",
    firstName: "",
    lastName: "",
    age: "",
    email: "",
    created_at: "",
    updated_at: "",
  };

  useEffect(() => {
    dispatch(getUsers());
  }, []);

  const handleOpen = () => {
    dispatch(openUserModal(data));
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
