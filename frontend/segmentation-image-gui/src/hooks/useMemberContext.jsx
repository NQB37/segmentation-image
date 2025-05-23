import { MemberContext } from '../context/MemberContext';
import { useContext } from 'react';
export const useMemberContext = () => {
    const context = useContext(MemberContext);
    if (!context)
        throw Error(
            'useMemberContext must be used inside MemberContextProvider',
        );
    return context;
};
