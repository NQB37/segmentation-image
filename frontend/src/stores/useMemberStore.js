import { create } from 'zustand';

export const useMemberStore = create((set) => ({
    members: [],
    setMembers: (members) => set({ members }),
    deleteMember: (deletedMember) =>
        set((state) => ({
            members: state.members.filter(
                (member) => member._id !== deletedMember._id,
            ),
        })),
}));
