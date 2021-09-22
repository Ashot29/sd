import React from "react";
import Button from "@material-ui/core/Button";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import Fade from "@material-ui/core/Fade";
import { BASE_URL } from "../../../../../stateManagement/url";
import { fetchingAllLists } from "../..";
import { useDispatch } from "react-redux";
import { fetchingAllCards } from "../..";
import ListService from "./../../../../../services/list.service";
import CardService from "./../../../../../services/cards.service";

const listService = ListService.getInstance();
const cardService = CardService.getInstance();

function deleteListWithItsCards(url, id, dispatch) {
  listService.delete(id).then(() => {
    cardService.getWithlistId(id).then((data) => {
      fetchingAllLists(url, dispatch);
      data.forEach((item) => {
        cardService.delete(item.id).then(() => fetchingAllCards(url, dispatch));
      });
    });
  });
}

export default function MenuButton({ id }) {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const dispatch = useDispatch();

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const deletingList = () => {
    deleteListWithItsCards(BASE_URL, id, dispatch);
    handleClose();
  };

  return (
    <>
      <Button
        aria-controls="fade-menu"
        aria-haspopup="true"
        onClick={handleClick}
      >
        <b>...</b>
      </Button>
      <Menu
        id="fade-menu"
        anchorEl={anchorEl}
        keepMounted
        open={open}
        onClose={handleClose}
        TransitionComponent={Fade}
      >
        <MenuItem onClick={deletingList}>
          Delete This List
        </MenuItem>
        <MenuItem onClick={handleClose}>
          Move This List
        </MenuItem>
      </Menu>
    </>
  );
}
