export const readableBoardFilter = (boardId, userId) => ({
    _id: boardId,
    $or: [{ ownerId: userId }, { membersId: userId }],
});

export const ownerBoardFilter = (boardId, userId) => ({
    _id: boardId,
    ownerId: userId,
});

export const pickBoardUpdates = (body, canEditAdminFields = false) => {
    const updates = {};
    const allowedFields = ['annotationImage', 'segmentImage'];

    if (canEditAdminFields) {
        allowedFields.push('title');
    }

    allowedFields.forEach((field) => {
        if (Object.prototype.hasOwnProperty.call(body, field)) {
            updates[field] = body[field];
        }
    });

    return updates;
};
