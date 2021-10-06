import { useState, useEffect } from "react";
import Backdrop from "@material-ui/core/Backdrop";
import Modal from "@material-ui/core/Modal";
import Fade from "@material-ui/core/Fade";
import { Button } from "@material-ui/core";
import { Typography } from "@material-ui/core";
import { TextField } from "@material-ui/core";
import Alert from "@mui/material/Alert";
import AlertTitle from "@mui/material/AlertTitle";
import Box from "@mui/material/Box";
import Autocomplete from "@mui/material/Autocomplete";
import { useSelector, useDispatch } from "react-redux";
import { closeUserModal } from "../../../stateManagement/actions/userModalActionCreator";
import UserService from "../../../services/user.service";
import { addUser } from "../../../stateManagement/actions/usersActionCreator";
import { updateUser } from "../../../stateManagement/actions/usersActionCreator";
import UserSequenceService from "../../../services/user-sequence.service";
import CountryService from "../../../services/countries.service";
import { RootState } from "../../../stateManagement/reducers/rootReducer";
import "./index.css";
import ICountry from "../../../services/countries.service";

const style = {
  position: "absolute" as "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 600,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};

export default function UserModal() {
  const userService = UserService.getInstance();
  const countryService = CountryService.getInstance();
  const userSequenceService = UserSequenceService.getInstance();
  const open = useSelector(
    (state: RootState) => state.userModalReducer.userModalIsOpen
  );
  const user = useSelector((state: RootState) => state.userModalReducer);
  const mode = useSelector(
    (state: RootState) => state.userModalReducer.userModalMode
  );
  let [emailError, setEmailError] = useState(false);
  let [countries, setCountries] = useState<any[]>([]);
  const dispatch = useDispatch();
  const [userInfo, updateUserInfo] = useState({
    id: user.id,
    firstName: user.firstName,
    lastName: user.lastName,
    age: user.age,
    email: user.email,
    country: user.country,
    subscribed_to_cards: [],
    created_at: user.created_at,
    updated_at: user.updated_at,
    userModalMode: user.userModalMode,
    userModalIsOpen: user.userModalIsOpen,
  });

  useEffect(() => {
    updateUserInfo({
      id: mode === "ADD" ? `${Date.now()}_${Math.random()}` : user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      age: user.age,
      email: user.email,
      country: user.country,
      subscribed_to_cards: [],
      created_at: user.created_at,
      updated_at: user.updated_at,
      userModalMode: user.userModalMode,
      userModalIsOpen: user.userModalIsOpen,
    });
  }, [user]);

  useEffect(() => {
    countryService.get().then((data) => {
      let countries = data.sort(compare);
      setCountries(countries);
    });
  }, []);

  function compare(a: ICountry, b: ICountry) {
    if (a.label < b.label) {
      return -1;
    }
    if (a.label > b.label) {
      return 1;
    }
    return 0;
  }

  const handleClose = () => {
    updateUserInfo({
      ...userInfo,
      id: "",
    });
    setEmailError(false);
    dispatch(closeUserModal());
  };

  function handleInputChange(event: any, inpValue: string) {
    if (user.country) return;
    updateUserInfo({
      ...userInfo,
      country: inpValue,
    });
  }

  function postNewUser() {
    userService.checkEmail(userInfo.email).then((data) => {
      // if there is such mail registered, dont post anything
      if (!data.length) {
        userService.post(userInfo);
        userSequenceService.getById(1).then((data) => {
          const sequence = data.sequence;
          sequence.push(userInfo.id);
          userSequenceService.update(1, { sequence });
        });
        dispatch(addUser(userInfo));
        handleClose();
      } else setEmailError(true);
    });
  }

  function changeExistingUser() {
    let updatedUser = JSON.parse(JSON.stringify(userInfo));
    delete updatedUser.subscribed_to_cards;
    userService.update(userInfo.id, updatedUser);

    dispatch(updateUser(updatedUser));
    handleClose();
  }

  function handleChange(event: any) {
    let { name, value } = event.target;
    if (!isNaN(+value)) value = +value;

    updateUserInfo((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  }

  function handleSubmit(event: any) {
    event.preventDefault();
    switch (mode) {
      case "ADD":
        postNewUser();
        break;
      case "EDIT":
        changeExistingUser();
        break;
      default:
        handleClose();
        break;
    }
  }

  return (
    <div>
      <Modal
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        open={open}
        onClose={handleClose}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
        }}
      >
        <Fade in={open}>
          <Box sx={style}>
            <Typography id="modal-modal-title" variant="h3" component="h2">
              User
            </Typography>
            <form
              id="user-modal-form"
              onSubmit={(event) => {
                handleSubmit(event);
              }}
            >
              <TextField
                style={{ width: "100%", margin: "30px 0 10px" }}
                required
                inputProps={{
                  pattern: "[a-zA-Z]{1,30}",
                  className: "firstname-input",
                }}
                name="firstName"
                autoComplete="off"
                id="outlined-required"
                label="FirstName"
                variant="outlined"
                defaultValue={user.firstName}
                onChange={(event) => handleChange(event)}
              />
              <TextField
                required
                inputProps={{
                  pattern: "[a-zA-Z]{1,30}",
                  className: "user-modal-input",
                }}
                name="lastName"
                autoComplete="off"
                style={{ width: "100%", marginBottom: "10px" }}
                id="outlined-required"
                label="LastName"
                variant="outlined"
                defaultValue={user.lastName}
                onChange={(event) => handleChange(event)}
              />
              <Autocomplete
                // required
                disabled={user.userModalMode === "EDIT" ? true : false}
                inputValue={userInfo.country}
                onInputChange={handleInputChange}
                id="country-select-demo"
                sx={{ width: "100%" }}
                options={countries}
                autoHighlight
                getOptionLabel={(option: any) => option.label}
                renderOption={(props, option) => (
                  <Box
                    component="li"
                    sx={{ "& > img": { mr: 2, flexShrink: 0 } }}
                    key={option.id}
                    {...props}
                  >
                    <img
                      loading="lazy"
                      width="20"
                      src={`https://flagcdn.com/w20/${option.code.toLowerCase()}.png`}
                      srcSet={`https://flagcdn.com/w40/${option.code.toLowerCase()}.png 2x`}
                      alt=""
                    />
                    {option.label}
                  </Box>
                )}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Choose a country"
                    variant="outlined"
                    inputProps={{
                      ...params.inputProps,
                      autoComplete: "new-password",
                    }}
                    required={true}
                  />
                )}
              />
              <TextField
                required
                error={mode === "ADD" ? emailError : false}
                disabled={mode === "EDIT" ? true : false}
                name="email"
                autoComplete="off"
                inputProps={{
                  pattern: "[a-zA-Z0-9._%+-]+@[a-z0-9.-]+.[a-z]{2,4}$",
                }}
                style={{ width: "100%", margin: "10px 0" }}
                id="outlined-required"
                label="Email"
                variant="outlined"
                defaultValue={user.email}
                onChange={(event) => handleChange(event)}
              />
              {!!emailError && (
                <Alert severity="error" style={{ marginBottom: "10px" }}>
                  <AlertTitle>Error</AlertTitle>
                  User with entered email already exists.
                </Alert>
              )}
              <TextField
                required
                name="age"
                autoComplete="off"
                style={{ width: "100%", marginBottom: "10px" }}
                inputProps={{
                  pattern: "[0-9]{3}",
                  min: 18,
                  max: 100,
                  step: 1,
                }}
                id="outlined-required"
                type="number"
                label="Age"
                variant="outlined"
                defaultValue={user.age}
                onChange={(event) => handleChange(event)}
              />
              <div className="confirm-button">
                <Button
                  type="submit"
                  form="user-modal-form"
                  variant="contained"
                  color="primary"
                  size="large"
                  style={{ marginRight: "30px" }}
                >
                  Confirm
                </Button>
                <Button
                  variant="outlined"
                  color="secondary"
                  size="large"
                  onClick={handleClose}
                >
                  Cancel
                </Button>
              </div>
            </form>
          </Box>
        </Fade>
      </Modal>
    </div>
  );
}
