import React from "react";
import "./App.css";
import { useEffect, useState } from "react";
import "../node_modules/bootstrap/dist/css/bootstrap.min.css";
import io from "socket.io-client";
import { useParams } from "react-router-dom";
import "./Chat.css";
import { useNavigate } from "react-router-dom";
import { GrHomeRounded } from "react-icons/gr";
import { FiUsers } from "react-icons/fi";

const socket = io.connect("http://localhost:3001");
export const Chat = () => {
  let navigate = useNavigate();
  const params = useParams();
  const [message, setMessage] = useState();
  const [roomsUsers, setRoomsUsers] = useState();

  function formatAMPM(date) {
    var hours = date.getHours();
    var minutes = date.getMinutes();
    var ampm = hours >= 12 ? "pm" : "am";
    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'
    minutes = minutes < 10 ? "0" + minutes : minutes;
    var strTime = hours + ":" + minutes + " " + ampm;
    return strTime;
  }

  const sendMessage = (e) => {
    e.preventDefault();
    socket.emit("send_message", {
      message: message,
      category: params.category,
      username: params.username,
    });
    let btn = document.querySelector(".form-control");
    btn.value = "";
    let time = formatAMPM(new Date());
    document.querySelector(".messages").insertAdjacentHTML(
      "beforeend",
      `<div class="col-6 offset-6 bg-dark rounded-3 p-3 shadow mb-3">
              <p class="p-0 m-0 text-white">${params.username} • ${time}</p>
              <p class="p-0 m-0 text-white">${message}</p> 
        </div>`
    );
    document.querySelector(".messages").scrollTop =
      document.querySelector(".messages").scrollHeight;
  };

  const leaveUser = () => {
    socket.disconnect();
  };

  useEffect(() => {}, [roomsUsers]);

  useEffect(() => {
    socket.on("recieve_message", (data) => {
      document.querySelector(".messages").insertAdjacentHTML(
        "beforeend",
        `<div class="col-6 bg-white rounded-3 p-3 shadow mb-3">
              <p class="p-0 m-0">${data.username} • ${data.time}</p>
              <p class="p-0 m-0">${data.text}</p> 
        </div>`
      );
      document.querySelector(".messages").scrollTop =
        document.querySelector(".messages").scrollHeight;
    });

    socket.on("someoneJoined", (data) => {
      document.querySelector(".messages").insertAdjacentHTML("beforeend", data);
      document.querySelector(".messages").scrollTop =
        document.querySelector(".messages").scrollHeight;
    });

    socket.on("message", (data) => {
      console.log("message came", data);
      document.querySelector(".messages").insertAdjacentHTML(
        "beforeend",
        `<div class="bg-danger rounded-3 p-3 shadow mb-3">
              <p class="p-0 m-0 text-white">${data.username} • ${data.time}</p>
              <p class="p-0 m-0 text-white">${data.text}</p> 
        </div>`
      );
      document.querySelector(".messages").scrollTop =
        document.querySelector(".messages").scrollHeight;
    });

    socket.on("roomsUsersServer", (data) => {
      setRoomsUsers(data);
    });
  }, [socket]);

  useEffect(() => {
    console.log("JOINING");
    socket.emit("joinRoom", {
      username: params.username,
      category: params.category,
    });
    console.log("JOINED");
  }, []);

  return (
    <div className="start">
      <div className="container-fluid pt-5">
        <div className="bg-light rounded-3 p-4 border shadow">
          <div className="text-end">
            <button
              className="btn btn-outline-danger mb-3"
              onClick={() => {
                leaveUser();
                navigate(`/`);
              }}
            >
              Leave Room
            </button>
          </div>
          <div className="row mb-4">
            <div className="col-auto">
              <div className="bg-white shadow rounded-3 p-3">
                <div className="room d-flex align-items-center">
                  <GrHomeRounded color="black" size={14} className="me-2" />{" "}
                  <p className="p-0 m-0">
                    {" "}
                    Room : <span className="fw-bold">{params.category}</span>
                  </p>
                </div>
              </div>
              <div className="bg-white shadow rounded-3 p-3 mt-3">
                <div className="users">
                  <div className="m-0 p-0 fw-bolder d-flex align-items-center">
                    <FiUsers size={15} />
                    <p className="m-0 p-0 ms-2">Users</p>
                  </div>
                  <div className="ms-3 mt-2">
                    {roomsUsers?.map((user) => {
                      return (
                        <p key={user.id} className="m-0">
                          {user.username}
                        </p>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
            <div className="col">
              <div>
                <div className="messages"></div>
              </div>
            </div>
          </div>
          <form onSubmit={sendMessage}>
            <div className="row">
              <div className="col">
                <input
                  type={"text"}
                  className="form-control"
                  onChange={(e) => {
                    setMessage(e.target.value);
                  }}
                />
              </div>
              <div className="col-auto">
                <input
                  type={"submit"}
                  className="btn btn-outline-dark"
                  value={"Send"}
                />
              </div>
            </div>
            <div className="text-end mt-4"></div>
          </form>
        </div>
      </div>
    </div>
  );
};
