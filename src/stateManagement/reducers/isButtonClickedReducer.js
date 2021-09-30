import { CHANGE_BUTTON_STATE } from "../actions/buttonActionCreator";

const initialState = {
  isButtonClicked: false,
};

export default function isButtonClicked(state = initialState, action) {
  switch (action.type) {
    case CHANGE_BUTTON_STATE:
      return {
        ...state,
        isButtonClicked: !state.isButtonClicked,
      };
    default:
      return state;
  }
}
