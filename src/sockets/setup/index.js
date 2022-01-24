const createRoom = () => {};

const registerSetup = (io, socket) => {
  socket.on("room:create", createRoom);
};

export default registerSetup;
