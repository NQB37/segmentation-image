const getEntityId = (entity) => entity?._id || entity;

const isBoardOwner = (board, user) => {
    const ownerId = getEntityId(board?.ownerId);
    const userId = getEntityId(user);

    return Boolean(ownerId && userId && String(ownerId) === String(userId));
};

export { isBoardOwner };
