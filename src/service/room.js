import axios from "axios";

// const baseUrl = `${process.env.API_SERVICE_URL}/api`
const baseUrl = "https://skillvitrine.wlt.life:3001/api/rooms";

const createRoom = async (owner) => {
  try {
    const response = await axios.post(`${baseUrl}/create`, { owner });
    return response;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

const deleteRoom = async (roomId) => {
  try {
    const response = await axios.delete(`${baseUrl}/delete/${roomId}`);
    return response;
  } catch (error) {
    console.error("Error deleting room:", error);
    throw error;
  }
};

//get a room by roonId
const getRoom = async (roomId) => {
  try {
    const response = await axios.get(`${baseUrl}/${roomId}`);
    return response;
  } catch (error) {
    console.error("Error getting room:", error);
    throw error;
  }
};
const joinRoom = async (roomId, user) => {
  try {
    const response = await axios.patch(`${baseUrl}/join/${roomId}`, { user });
    return response;
  } catch (error) {
    console.error("Error joining room:", error);
    throw error;
  }
};

const leaveRoom = async (roomId, user) => {
  try {
    const response = await axios.patch(`${baseUrl}/leave/${roomId}`, { user });
    return response;
  } catch (error) {
    console.error("Error leaving room:", error);
    throw error;
  }
};

const roomsAPI = {
  createRoom,
  deleteRoom,
  getRoom,
  leaveRoom,
  joinRoom,
};

export default roomsAPI;
