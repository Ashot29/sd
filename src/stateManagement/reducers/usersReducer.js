export const usersInitialData = {
  users: [],
};

export function usersReducer(state = usersInitialData, action) {
  switch (action.type) {
    case "DISPATCH_USERS_TO_STORE":
      return {
        ...state,
        users: [...action.payload.users],
      };
    case "DELETE_USER":
      return {
        ...state,
        users: [...state.users.filter((user) => user.id !== action.payload.id)],
      };
    case "ADD_USER":
      return {
        ...state,
        users: [...state.users, action.payload.user],
      };
    case "UPDATE_USER":
      const users = state.users.filter((user) => user.id !== action.payload.id);
      return {
        ...state,
        users: [...users, action.payload],
      };
    default:
      return state;
  }
}
