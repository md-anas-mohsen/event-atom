import React from "react";
import { Link } from "react-router-dom";

const EventCard = ({
  eventId,
  eventName,
  eventDescription,
  eventDate,
  eventTime,
  eventLocation,
  eventData,
}) => {
  return (
    <div className="card">
      {/* <img src="..." className="card-img-top" alt="..." /> */}
      <div className="card-body">
        <Link
          className="nav-link"
          to={{ pathname: `/event/${eventId}`, state: eventData }}
        >
          <h5 className="card-title">{eventName}</h5>
        </Link>
        <p className="card-text">{eventDescription}</p>
      </div>
      <ul className="list-group list-group-flush">
        <li className="list-group-item d-flex justify-content-between align-items-center">
          <i className="fa-regular fa-calendar px-4"></i>
          {new Date(eventDate.seconds * 1000).toUTCString()}
        </li>
        <li className="list-group-item d-flex justify-content-between align-items-center">
          <i className="fa-regular fa-clock px-4"></i>
          {eventTime}
        </li>
        <li className="list-group-item d-flex justify-content-between align-items-center">
          <i className="fa-solid fa-location-dot px-4"></i>
          {eventLocation}
        </li>
      </ul>
      {/* <div className="card-body">
          <a href="#" className="card-link">
            Card link
          </a>
          <a href="#" className="card-link">
            Another link
          </a>
        </div> */}
    </div>
  );
};

export default EventCard;
