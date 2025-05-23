import { createContext, useReducer } from 'react';

export const MemberContext = createContext();

export const membersReducer = (state, action) => {
    switch (action.type) {
        case 'SET_MEMBERS':
            return { members: action.payload };
        case 'DELETE_MEMBER':
            return {
                members: state.members.filter(
                    (memeber) => memeber._id !== action.payload._id,
                ),
            };
        default:
            return state;
    }
};
export const MemberContextProvider = ({ children }) => {
    const [state, membersDispatch] = useReducer(membersReducer, {
        members: [],
    });
    return (
        <MemberContext.Provider value={{ ...state, membersDispatch }}>
            {children}
        </MemberContext.Provider>
    );
};
