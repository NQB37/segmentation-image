let ioInstance = null;
const userRoom = (userId) => `user:${userId}`;
const setSocketServer = (io) => {
  ioInstance = io;
};
const getSocketServer = () => ioInstance;
const emitToUser = (userId, eventName, payload) => {
  if (!ioInstance || !userId) {
    return;
  }
  ioInstance.to(userRoom(userId)).emit(eventName, payload);
};

export { emitToUser, getSocketServer, setSocketServer, userRoom };
