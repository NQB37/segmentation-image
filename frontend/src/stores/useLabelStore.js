import { create } from 'zustand';

export const useLabelStore = create((set) => ({
    labels: [],
    setLabels: (labels) => set({ labels }),
    createLabel: (label) =>
        set((state) => ({ labels: [label, ...state.labels] })),
    deleteLabel: (deletedLabel) =>
        set((state) => ({
            labels: state.labels.filter(
                (label) => label._id !== deletedLabel._id,
            ),
        })),
}));
