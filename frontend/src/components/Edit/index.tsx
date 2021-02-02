import React, { useState } from "react";
import AdminControl from "components/AdminControl";
import API from "rest/api";
import { toast } from "react-toastify";
import { IUserEvent } from "rest/user_events";

interface IProps {
  event: IUserEvent;
  setUserEvents: (userEvents: Array<IUserEvent>) => void;
  userEvents: Array<IUserEvent>;
}

const Edit = ({ event, userEvents, setUserEvents }: IProps) => {
  const [open, setOpen] = useState(false);

  const toggleOpen = () => {
    setOpen((prevProps) => !prevProps);
  };

  const handleRemove = () => {
    API.userEvents
      .editUserEvent({
        ...event,
        enabled: false,
      })
      .then((res) => {
        if (res.success) {
          toast.success("Removed user");
          const newEvents = [...userEvents].filter(
            (evt) => evt.id !== event.id
          );
          setUserEvents(newEvents);
        } else {
          toast.error("Could not remove user");
        }
      });
  };

  const handlePaid = () => {
    API.userEvents
      .editUserEvent({
        ...event,
        paid: !event.paid,
      })
      .then((res) => {
        if (res.success) {
          toast.success(`Paid status is now : ${!event.paid}`);
          const newEvents = [...userEvents];
          for (let i = 0; i < newEvents.length; i += 1) {
            if (newEvents[i].id === event.id) {
              newEvents[i].paid = !newEvents[i].paid;
              break;
            }
          }
          setUserEvents(newEvents);
        } else {
          toast.error("Could not update paid status");
        }
      });
  };

  if (!open) return <button onClick={toggleOpen}>Edit</button>;
  return (
    <ul>
      <li>
        <button onClick={handleRemove}>Remove</button>
      </li>
      <li>
        <button onClick={handlePaid}>Mark as paid</button>
      </li>
    </ul>
  );
};

export default AdminControl(Edit);
