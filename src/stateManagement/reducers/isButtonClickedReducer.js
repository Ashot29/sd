import { initialState } from "../store/initialState";

export default function isButtonClicked(state = initialState, action) {
  switch (action.type) {
    case "CHANGE_BUTTON_STATE":
      return {
        ...state,
        isButtonClicked: !state.isButtonClicked,
      };
    case "CHANGE_MODAL_STATE":
      return {
        ...state,
        modalIsOpen: !state.modalIsOpen,
      };
    default:
      return state;
  }
}
