export const usersInitialData = {
    users: []
}

export function usersReducer(state = usersInitialData, action) {
    switch(action.type) {
        case 'DISPATCH_USERS_TO_STORE':
            return {
                ...state,
                users: [...action.payload.users]
            }
        // case 'CHANGE_USER_SUBSCRIPTIONS':
        //     return {
        //         ...state,
        //         users: [
        //             state.users.splice(action.payload.index, 1)
        //         ]
        //     }
        default:
            return state
    }
}