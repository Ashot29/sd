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
        default:
            return state
    }
}