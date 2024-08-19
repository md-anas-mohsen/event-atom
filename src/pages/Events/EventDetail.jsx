import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { db } from "../../firebase";
import {
  arrayUnion,
  doc,
  getDoc,
  getFirestore,
  onSnapshot,
  updateDoc,
} from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { useUser } from "../../context/UserContext";

const EventDetail = ({ location }) => {
  const navigate = useNavigate();
  const params = useParams();
  const { user } = useUser();
  const { eventId } = params;
  const [loading, setLoading] = useState(false);
  const [event, setEvent] = useState(null);
  const [commentText, setCommentText] = useState("");

  useEffect(() => {
    const eventDocRef = doc(db, "events", eventId);

    // Set up a real-time listener for the specific event document
    const unsubscribe = onSnapshot(
      eventDocRef,
      (docSnapshot) => {
        if (docSnapshot.exists()) {
          setEvent(docSnapshot.data());
        } else {
          console.log("Event does not exist!");
        }
      },
      (error) => {
        console.error("Error fetching event: ", error);
        alert(error);
      }
    );

    async function getEvent() {
      setLoading(true);
      const docRef = doc(db, "events", eventId);
      const docSnap = await getDoc(docRef);
      setEvent(docSnap.data());
      setLoading(false);
    }
    getEvent();
  }, [eventId]);

  useEffect(() => {
    if (event) {
      console.log(event);
    }
    if (
      event &&
      (user.uid !== event.createdBy || !event.attendees.includes(user.email))
    ) {
      navigate("/");
    }
  }, [event]);

  if (loading) {
    return (
      <div className="spinner-border text-primary" role="status">
        <span className="visually-hidden">Loading...</span>
      </div>
    );
  }

  const postComment = async (e) => {
    e.preventDefault();

    const db = getFirestore();

    if (user) {
      try {
        // Reference to the event document
        const eventDocRef = doc(db, "events", eventId);

        // New comment object
        const newComment = {
          user: user.email,
          message: commentText,
        };

        console.log(newComment);

        // Append the new comment to the messages array using arrayUnion
        await updateDoc(eventDocRef, {
          messages: arrayUnion(newComment),
        });

        console.log("Comment added successfully!");
      } catch (error) {
        console.error("Error posting comment: ", error);
      }
    } else {
      console.error("User not authenticated!");
    }
  };

  return (
    <div>
      <div className="container p-5">
        <div className="row">
          <div className="col-sm-12">
            <div className="card">
              <div className="card-header">Event</div>
              <div className="card-body">
                <h5 className="card-title">
                  {event && !!event.title && event.title}
                </h5>
                <p className="card-text">
                  {event && !!event.description && event.description}
                </p>
              </div>
            </div>
          </div>
        </div>
        <div className="row">
          <div className="col-sm-4 g-5">
            <div className="card">
              <div className="card-body">
                <h5 className="card-title">Date</h5>
                <p className="card-text">
                  {event &&
                    !!event.date &&
                    new Date(event.date.seconds * 1000).toUTCString()}
                </p>
              </div>
            </div>
          </div>
          <div className="col-sm-4 g-5">
            <div className="card">
              <div className="card-body">
                <h5 className="card-title">Time</h5>
                <p className="card-text">
                  {event && !!event.time && event.time}
                </p>
              </div>
            </div>
          </div>
          <div className="col-sm-4 g-5">
            <div className="card">
              <div className="card-body">
                <h5 className="card-title">Location</h5>
                <p className="card-text">
                  {event && !!event.location && event.location}
                </p>
              </div>
            </div>
          </div>
        </div>
        <div className="row d-flex justify-content-center">
          <div className="col-md-6 col-sm-12 g-5">
            <div className="card">
              <div className="card-header">Attendees</div>
              <ul className="list-group list-group-flush">
                {event &&
                  !!event.attendees &&
                  event.attendees.map((attendee) => (
                    <li className="list-group-item" key={attendee}>
                      {attendee}
                    </li>
                  ))}
              </ul>
            </div>
          </div>
        </div>
        <div className="row d-flex justify-content-center">
          <div className="col-sm-12 g-5">
            <div className="card">
              <div className="card-header">Updates</div>
              <ul className="list-group list-group-flush">
                {event &&
                  !!event.messages &&
                  event.messages.map((message, index) => (
                    <li
                      className="list-group-item row d-flex justify-content-between align-items-center"
                      key={index}
                    >
                      <div className="col-sm-4">
                        <p className="text-nowrap fw-bold">{message.user}</p>
                      </div>
                      <div className="col-sm-8">{message.message}</div>
                    </li>
                  ))}
                <li className="list-group-item row d-flex justify-content-between align-items-center">
                  <div className="col-sm-4"></div>
                  <div className="col-sm-8">
                    <form>
                      <div className="input-group mb-3">
                        <input
                          type="text"
                          className="form-control"
                          placeholder="Post an update"
                          aria-label="Post an update"
                          aria-describedby="button-addon2"
                          onChange={(e) => setCommentText(e.target.value)}
                        />
                        <button
                          className="btn btn-outline-secondary"
                          type="submit"
                          id="button-addon2"
                          onClick={postComment}
                        >
                          Post
                        </button>
                      </div>
                    </form>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventDetail;
