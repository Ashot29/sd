import { CHANGE_BUTTON_STATE } from "../actions/buttonActionCreator";

const buttonInitialState = {
  isButtonClicked: false,
};

interface IButtonInitialState {
  isButtonClicked: boolean
}

export default function isButtonClicked(state: IButtonInitialState = buttonInitialState, action: any) {
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
