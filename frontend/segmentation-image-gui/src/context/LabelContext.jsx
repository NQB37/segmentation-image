import { createContext, useReducer } from 'react';

export const LabelContext = createContext();

export const labelsReducer = (state, action) => {
    switch (action.type) {
        case 'SET_LABELS':
            return { labels: action.payload };
        case 'CREATE_LABEL':
            return { labels: [action.payload, ...state.labels] };
        case 'DELETE_LABEL':
            return {
                labels: state.labels.filter(
                    (label) => label._id !== action.payload._id,
                ),
            };
        default:
            return state;
    }
};
export const LabelContextProvider = ({ children }) => {
    const [state, labelsDispatch] = useReducer(labelsReducer, { labels: [] });
    return (
        <LabelContext.Provider value={{ ...state, labelsDispatch }}>
            {children}
        </LabelContext.Provider>
    );
};
