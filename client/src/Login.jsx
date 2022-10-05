import React from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export const Login = () => {
  let navigate = useNavigate();
  const [username, setUsername] = useState();
  const [category, setCategory] = useState("MMA");
  return (
    <div className="container mt-5">
      <div className="bg-light rounded-3 p-3 border shadow">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            navigate(
              `/chat/${username.toLocaleLowerCase()}/${category.toLocaleLowerCase()}/`
            );
          }}
        >
          <h5 className="text-center mt-3 mb-4">Join a Room</h5>
          <label htmlFor="username">Username</label>
          <input
            type="text"
            name="username"
            id="username"
            onChange={(e) => {
              setUsername(e.target.value);
            }}
            required
            className="form-control shadow-sm"
          />
          <label htmlFor="room" className="mt-4">
            Room
          </label>
          <select
            className="form-select"
            name="category"
            onChange={(e) => {
              setCategory(e.target.value);
            }}
            required
          >
            <option value="MMA">MMA</option>
            <option value="Sambo">Sambo</option>
            <option value="Boxing">Boxing</option>
            <option value="Kickboxing">Kickboxing</option>
          </select>
          <div className="text-center">
            <input
              type="submit"
              value="Join"
              className="btn btn-outline-success mt-4 px-4"
            />
          </div>
        </form>
      </div>
    </div>
  );
};
