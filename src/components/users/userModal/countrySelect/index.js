import React, { useState } from "react";
import { useSelector } from "react-redux";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";

export default function CountryAutocomplete({ userInfo, updateUserInfo, countries }) {
  const user = useSelector((state) => state.userModalReducer);
  const [value, setValue] = useState('');

  function handleInputChange(event, inpValue) {
    updateUserInfo({
      ...userInfo,
      country: inpValue,
    });
    setValue(inpValue);
  }

  return (
    <Autocomplete
      required
      disabled={user.userModalMode === "EDIT" ? true : false}
      onInputChange={handleInputChange}
      id="country-select-demo"
      sx={{ width: "100%" }}
      options={countries}
      autoHighlight
      getOptionLabel={(option) => option.label}
      inputValue={user.userModalMode === "EDIT" ? user.country : value}
      onChange={(event) => setValue(event.target.inputValue)}
      renderOption={(props, option) => (
        <Box
          component="li"
          sx={{ "& > img": { mr: 2, flexShrink: 0 } }}
          key={countries.id}
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
          inputProps={{
            ...params.inputProps,
            autoComplete: "new-password",
          }}
          required={true}
        />
      )}
    />
  );
}
