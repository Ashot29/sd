import React from "react";
import Button from "@material-ui/core/Button";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import Fade from "@material-ui/core/Fade";
import { fetchingAllLists } from "../..";
import { useDispatch } from "react-redux";
import { fetchingAllCards } from "../..";
import ListService from "../../../../../services/list.service";
import CardService from "../../../../../services/cards.service";
import ICard from'../../../../../services/cards.service'

const listService: any = ListService.getInstance();
const cardService: any = CardService.getInstance();

function deleteListWithItsCards(id: string, dispatch: any) {
  listService.delete(id).then(() => {
    cardService.getWithlistId(id).then((data: ICard[]) => {
      fetchingAllLists(dispatch);
      data.forEach((item: ICard) => {
        cardService.delete(item.id).then(() => fetchingAllCards(dispatch));
      });
    });
  });
}

interface MenuButtonProps {
  id: string;
}

export default function MenuButton({id}: MenuButtonProps) {
  const [anchorEl, setAnchorEl] = React.useState<any>(null);
  const open = Boolean(anchorEl);
  const dispatch = useDispatch();

  const handleClick = (event: any) => {
    event.preventDefault();
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const deletingList = () => {
    deleteListWithItsCards(id, dispatch);
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
        <MenuItem onClick={deletingList}>Delete This List</MenuItem>
        <MenuItem onClick={handleClose}>Move This List</MenuItem>
      </Menu>
    </>
  );
}
