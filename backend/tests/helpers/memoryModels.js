import mongoose from 'mongoose';

const store = {
    users: [],
    boards: [],
    labels: [],
    invites: [],
};

const resetStore = () => {
    store.users = [];
    store.boards = [];
    store.labels = [];
    store.invites = [];
};

const newId = () => new mongoose.Types.ObjectId();

const sameValue = (left, right) => String(left) === String(right);
const isPlainObject = (value) =>
    Boolean(value) && typeof value === 'object' && value.constructor === Object;

const matches = (doc, filter = {}) => {
    if (!filter || Object.keys(filter).length === 0) {
        return true;
    }

    if (filter.$or) {
        return filter.$or.some((clause) => matches(doc, clause));
    }

    return Object.entries(filter).every(([key, expected]) => {
        const actual = doc[key];

        if (isPlainObject(expected)) {
            if (Array.isArray(expected.$in)) {
                if (Array.isArray(actual)) {
                    return actual.some((item) =>
                        expected.$in.some((candidate) =>
                            sameValue(item, candidate),
                        ),
                    );
                }

                return expected.$in.some((candidate) =>
                    sameValue(actual, candidate),
                );
            }

            return matches(actual || {}, expected);
        }

        if (Array.isArray(actual)) {
            return actual.some((item) => sameValue(item, expected));
        }

        return sameValue(actual, expected);
    });
};

const applyProjection = (doc, fields) => {
    if (!doc || !fields) {
        return doc;
    }

    const picked = {};
    for (const field of String(fields).split(/\s+/)) {
        if (field && doc[field] !== undefined) {
            picked[field] = doc[field];
        }
    }

    return Object.keys(picked).length > 0 ? picked : doc;
};

const createQuery = (resolver) => {
    const query = {
        select(fields) {
            query._select = fields;
            return query;
        },
        populate() {
            return query;
        },
        sort() {
            return query;
        },
        exec() {
            return Promise.resolve(resolver()).then((doc) =>
                applyProjection(doc, query._select),
            );
        },
        then(resolve, reject) {
            return query.exec().then(resolve, reject);
        },
        catch(reject) {
            return query.exec().catch(reject);
        },
    };

    return query;
};

const cloneArray = (value = []) => value.map((item) => item);

const createUserDoc = (attrs = {}) => ({
    _id: attrs._id || newId(),
    email: attrs.email,
    name: attrs.name,
    password: attrs.password,
    avatar: attrs.avatar,
    createdAt: new Date(),
    updatedAt: new Date(),
});

const createBoardDoc = (attrs = {}) => ({
    _id: attrs._id || newId(),
    title: attrs.title,
    image: attrs.image,
    ownerId: attrs.ownerId,
    membersId: cloneArray(attrs.membersId),
    labelsId: cloneArray(attrs.labelsId),
    annotationImage: attrs.annotationImage ?? '',
    segmentImage: attrs.segmentImage ?? '',
    createdAt: new Date(),
    updatedAt: new Date(),
});

const createLabelDoc = (attrs = {}) => ({
    _id: attrs._id || newId(),
    title: attrs.title,
    color: attrs.color,
    createdAt: new Date(),
    updatedAt: new Date(),
});

const createInviteDoc = (attrs = {}) => ({
    _id: attrs._id || newId(),
    toId: attrs.toId,
    boardId: attrs.boardId,
    status: attrs.status,
    createdAt: new Date(),
    updatedAt: new Date(),
});

const mutateDoc = (doc, update = {}) => {
    if (!doc) {
        return doc;
    }

    const directUpdate =
        Object.keys(update).length > 0 && !update.$set && !update.$addToSet && !update.$pull;
    const next = directUpdate ? update : update.$set || {};
    Object.assign(doc, next);

    if (update.$addToSet) {
        for (const [key, value] of Object.entries(update.$addToSet)) {
            const existing = Array.isArray(doc[key]) ? doc[key] : [];
            if (!existing.some((item) => sameValue(item, value))) {
                doc[key] = [...existing, value];
            }
        }
    }

    if (update.$pull) {
        for (const [key, value] of Object.entries(update.$pull)) {
            const existing = Array.isArray(doc[key]) ? doc[key] : [];
            doc[key] = existing.filter((item) => !sameValue(item, value));
        }
    }

    doc.updatedAt = new Date();
    return doc;
};

const userModel = {
    create(attrs) {
        const doc = createUserDoc(attrs);
        store.users.push(doc);
        return Promise.resolve(doc);
    },
    findOne(filter) {
        return createQuery(() => store.users.find((doc) => matches(doc, filter)) || null);
    },
    findById(id) {
        return createQuery(() => store.users.find((doc) => sameValue(doc._id, id)) || null);
    },
};

const boardModel = {
    create(attrs) {
        const doc = createBoardDoc(attrs);
        store.boards.push(doc);
        return Promise.resolve(doc);
    },
    find(filter) {
        return createQuery(() => store.boards.filter((doc) => matches(doc, filter)));
    },
    findById(id) {
        return createQuery(() => store.boards.find((doc) => sameValue(doc._id, id)) || null);
    },
    findOneAndUpdate(filter, update) {
        const doc = store.boards.find((item) => matches(item, filter)) || null;
        return Promise.resolve(mutateDoc(doc, update));
    },
    findByIdAndUpdate(id, update) {
        const doc = store.boards.find((item) => sameValue(item._id, id)) || null;
        return Promise.resolve(mutateDoc(doc, update));
    },
    findOneAndDelete(filter) {
        const index = store.boards.findIndex((item) => matches(item, filter));
        if (index === -1) {
            return Promise.resolve(null);
        }
        const [removed] = store.boards.splice(index, 1);
        return Promise.resolve(removed);
    },
    countDocuments(filter) {
        return Promise.resolve(store.boards.filter((doc) => matches(doc, filter)).length);
    },
    distinct(field, filter) {
        const values = store.boards
            .filter((doc) => matches(doc, filter))
            .flatMap((doc) => (Array.isArray(doc[field]) ? doc[field] : [doc[field]]))
            .filter(Boolean);
        const unique = [];
        for (const value of values) {
            if (!unique.some((item) => sameValue(item, value))) {
                unique.push(value);
            }
        }
        return Promise.resolve(unique);
    },
};

const labelModel = {
    create(attrs) {
        const doc = createLabelDoc(attrs);
        store.labels.push(doc);
        return Promise.resolve(doc);
    },
    findById(id) {
        return createQuery(() => store.labels.find((doc) => sameValue(doc._id, id)) || null);
    },
    findOneAndDelete(filter) {
        const index = store.labels.findIndex((doc) => matches(doc, filter));
        if (index === -1) {
            return Promise.resolve(null);
        }
        const [removed] = store.labels.splice(index, 1);
        return Promise.resolve(removed);
    },
    deleteMany(filter) {
        const before = store.labels.length;
        store.labels = store.labels.filter((doc) => !matches(doc, filter));
        return Promise.resolve({ deletedCount: before - store.labels.length });
    },
};

const inviteModel = {
    create(attrs) {
        const doc = createInviteDoc(attrs);
        store.invites.push(doc);
        return Promise.resolve(doc);
    },
    find(filter) {
        return createQuery(() => store.invites.filter((doc) => matches(doc, filter)));
    },
    findOne(filter) {
        return createQuery(() => store.invites.find((doc) => matches(doc, filter)) || null);
    },
    findById(id) {
        return createQuery(() => store.invites.find((doc) => sameValue(doc._id, id)) || null);
    },
    findOneAndUpdate(filter, update) {
        const doc = store.invites.find((item) => matches(item, filter)) || null;
        return Promise.resolve(mutateDoc(doc, update));
    },
    countDocuments(filter) {
        return Promise.resolve(store.invites.filter((doc) => matches(doc, filter)).length);
    },
};

export {
    resetStore,
    store,
    userModel,
    boardModel,
    labelModel,
    inviteModel,
    createUserDoc,
    createBoardDoc,
    createLabelDoc,
    createInviteDoc,
};
