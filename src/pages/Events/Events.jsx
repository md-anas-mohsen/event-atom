import React, { useEffect, useState } from "react";
import EventCard from "../../components/Events/EventCard";
import { useNavigate } from "react-router-dom";
import { useUser } from "../../context/UserContext";
import { db } from "../../firebase";
import {
  collection,
  addDoc,
  Timestamp,
  query,
  orderBy,
  onSnapshot,
  getDocs,
  where,
} from "firebase/firestore";

import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const Events = () => {
  const navigate = useNavigate();
  const { user, login, logout } = useUser();

  const [events, setEvents] = useState([]);
  const [groupedEvents, setGroupedEvents] = useState([]);
  const [showInvitedEvents, setShowInvitedEvents] = useState(false);
  const [loading, setLoading] = useState();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState(new Date());
  const [time, setTime] = useState(null);
  const [location, setLocation] = useState("");
  const [attendees, setAttendees] = useState("");

  useEffect(() => {
    if (!user) {
      navigate("/login");
    }
  }, [user]);

  const fetchEvents = async () => {
    setLoading(true);
    try {
      // Reference to the events collection
      const eventsCollection = query(
        collection(db, "events"),
        where("createdBy", "==", user.uid)
      );

      // Fetch all documents from the events collection
      const eventSnapshot = await getDocs(eventsCollection);

      // Extract the data from each document
      const eventList = eventSnapshot.docs.map((doc) => ({
        id: doc.id, // Optionally include the document ID
        data: doc.data(), // Spread the document data into the object
      }));

      let chunkSize = 3;
      const chunks = [];
      for (let i = 0; i < eventList.length; i += chunkSize) {
        chunks.push(eventList.slice(i, i + chunkSize));
      }

      // Update the state with the fetched events
      setEvents(chunks);
    } catch (error) {
      console.error("Error fetching events: ", error);
      alert(error);
    }
    setLoading(false);
  };

  const fetchInvitedEvents = async () => {
    setLoading(true);
    if (!!user && !!user.email) {
      try {
        // Create a query to find documents where the attendees array contains the given email
        const q = query(
          collection(db, "events"),
          where("createdBy", "!=", user.uid),
          where("attendees", "array-contains", user.email)
        );

        // Execute the query and get the documents
        const querySnapshot = await getDocs(q);

        const eventsList = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        setEvents(eventsList);
      } catch (error) {
        console.error("Error fetching events: ", error);
      }
    } else {
      console.error("Email not provided!");
    }
    setLoading(false);
  };

  useEffect(() => {
    if (user) {
      const q = query(
        collection(db, "events"),
        orderBy("created", "desc"),
        where("attendees", "array-contains", user.email)
      );
      onSnapshot(q, (querySnapshot) => {
        console.log(
          querySnapshot.docs.map((doc) => ({
            id: doc.id,
            data: doc.data(),
          }))
        );

        setEvents(
          querySnapshot.docs.map((doc) => ({
            id: doc.id,
            data: doc.data(),
          }))
        );
      });

      if (showInvitedEvents) {
        fetchInvitedEvents();
      } else {
        fetchEvents();
      }
    }
  }, [user, showInvitedEvents]);

  const createEvent = async (e) => {
    setLoading(true);
    e.preventDefault();
    try {
      await addDoc(collection(db, "events"), {
        title,
        description,
        date,
        time,
        location,
        attendees: attendees.split(","),
        createdBy: user.uid,
      });
    } catch (err) {
      alert(err);
    }
    setLoading(false);
    fetchEvents();
    document.getElementById("createEventModal").classList.remove("show");
  };

  return (
    <div>
      <div className="container p-5">
        <h1>Events</h1>
        <div className="card text-center">
          <div className="card-header">
            <ul className="nav nav-underline card-header-tabs">
              <li className="nav-item">
                <a
                  className="nav-link btn btn-link"
                  aria-current="true"
                  href="#"
                  onClick={(e) => setShowInvitedEvents(false)}
                >
                  My Events
                </a>
              </li>
              <li className="nav-item">
                <a
                  className="nav-link btn btn-link"
                  href="#"
                  onClick={(e) => setShowInvitedEvents(true)}
                >
                  Invited Events
                </a>
              </li>
              <li className="nav-item">
                <button
                  type="button"
                  className="btn btn-primary"
                  data-bs-toggle="modal"
                  data-bs-target="#createEventModal"
                >
                  Create Event
                </button>
              </li>
            </ul>
          </div>
          <div className="card-body">
            {!loading ? (
              events.map((eventGroup, index) => (
                <div className="row" key={index}>
                  {eventGroup.map((event) => (
                    <div className="col-12 col-md-4" key={event.id}>
                      <EventCard
                        id={event.id}
                        eventId={event.id}
                        eventName={event.data.title}
                        eventDescription={event.data.description}
                        eventDate={event.data.date}
                        eventTime={event.data.time}
                        eventLocation={event.data.location}
                        eventData={event.data}
                      />
                    </div>
                  ))}
                </div>
              ))
            ) : (
              <div className="row d-flex align-items-center justify-content-center">
                <div className="spinner-border text-primary" role="status">
                  <span className="visually-hidden">Loading...</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <div
        className="modal fade"
        id="createEventModal"
        tabindex="-1"
        aria-labelledby="createEventModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h1 className="modal-title fs-5" id="createEventModalLabel">
                Create Event
              </h1>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body">
              <form>
                <div data-mdb-input-init className="form-outline mb-4">
                  <input
                    type="text"
                    id="title"
                    className="form-control"
                    onChange={(e) => setTitle(e.target.value)}
                    required
                  />
                  <label className="form-label" htmlFor="title">
                    Title
                  </label>
                </div>

                <div data-mdb-input-init className="form-outline mb-4">
                  <textarea
                    className="form-control"
                    id="description"
                    rows="4"
                    onChange={(e) => setDescription(e.target.value)}
                    required
                  ></textarea>
                  <label className="form-label" htmlFor="description">
                    Description
                  </label>
                </div>

                <div data-mdb-input-init className="form-outline mb-4">
                  <input
                    id="time"
                    aria-label="Time"
                    type="time"
                    onChange={(e) => setTime(e.target.value)}
                    required
                  />
                  <label className="form-label" htmlFor="time">
                    Time
                  </label>
                </div>

                <div data-mdb-input-init className="form-outline mb-4">
                  <DatePicker
                    id="date"
                    selected={date}
                    onChange={(date) => setDate(date)}
                    required
                  />
                  <label className="form-label" htmlFor="date">
                    Date
                  </label>
                </div>

                <div data-mdb-input-init className="form-outline mb-4">
                  <input
                    type="text"
                    id="location"
                    className="form-control"
                    onChange={(e) => setLocation(e.target.value)}
                    required
                  />
                  <label className="form-label" htmlFor="location">
                    Location
                  </label>
                </div>

                <div data-mdb-input-init className="form-outline mb-4">
                  <textarea
                    className="form-control"
                    id="form4Example3"
                    rows="4"
                    onChange={(e) => setAttendees(e.target.value)}
                    required
                  ></textarea>
                  <label className="form-label" htmlFor="form4Example3">
                    Attendees (comma separated emails)
                  </label>
                </div>
              </form>
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary"
                data-bs-dismiss="modal"
              >
                Close
              </button>
              <button
                type="button"
                className="btn btn-primary"
                onClick={createEvent}
                disabled={loading}
              >
                Save changes
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Events;
