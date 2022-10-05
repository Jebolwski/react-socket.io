const moment = require("moment");
const users = [];

//A user joins category
function userJoin(id, username, category) {
  const user = { id, username, category };
  users.push(user);
  return user;
}

//Get current user
function getUser(id) {
  return users.find((user) => user.id == id);
}

//A user leaves a chat
function userLeave(id) {
  const user = users.findIndex((user) => user.id == id);
  if (user != -1) {
    return users.splice(user, 1)[0];
  }
}

//A rooms users
function getRoomsUsers(category) {
  return users.filter((user) => user.category == category);
}

module.exports = {
  userJoin,
  userLeave,
  getUser,
  getRoomsUsers,
};
