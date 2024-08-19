//Profile.js
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "../../context/UserContext";

const Profile = () => {
  const navigate = useNavigate();
  const { user, login, logout } = useUser();

  useEffect(() => {
    if (!user) {
      navigate("/login");
    }
  }, [user]);

  return (
    <div>
      {user ? (
        <div className="container">
          <div className="row m-5">
            <div className="col-sm-12">
              <div className="card">
                <div className="card-body">
                  <h1>Hello {user.email}</h1>
                </div>
              </div>
            </div>
          </div>
          <div className="row m-5">
            <div className="col-sm-12">
              <div className="card">
                <div className="card-body">
                  <button className="btn btn-danger" onClick={(e) => logout()}>
                    Logout
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <></>
      )}
    </div>
  );
};

export default Profile;
