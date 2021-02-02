import React, { useEffect, useState } from "react";
import { useParams, useLocation, Redirect } from "react-router-dom";
import API from "rest/api";
import { IEvent } from "rest/events";
import { IUserEvent } from "rest/user_events";
import style from "./style.module.scss";
import pageStyle from "styles/pages.module.scss";

import SignupSheet from "./SignUp";
import EventDate from "components/EventDate";

interface ParamTypes {
  eventid?: string;
}

const Event = () => {
  const { state } = useLocation<IEvent | undefined>();
  const { eventid } = useParams<ParamTypes>();

  const [event, setEvent] = useState<IEvent | undefined>(undefined);
  const [userEvents, setUserEvents] = useState<Array<IUserEvent> | undefined>(
    undefined
  );

  useEffect(() => {
    if (eventid === undefined) return;

    if (state === undefined) {
      API.events.getEvent(eventid).then((res) => {
        if (res.success) {
          setEvent(res.result);
        }
      });
    } else {
      setEvent(state);
    }

    API.userEvents.getUserEvents(eventid).then((res) => {
      if (res.success) {
        console.log(res.result);
        setUserEvents(res.result);
      }
    });
  }, [state, eventid]);

  if (eventid === undefined) {
    return <Redirect to="/" />;
  }

  if (event === undefined) return null;
  const { description, enabled, name, start } = event;
  return (
    <section className={pageStyle.area}>
      <div className={pageStyle.child}>
        <div className={style.eventArea}>
          <div className={style.titleArea}>
            <h1 className={style.title}>{name}</h1>
            {enabled === true && <EventDate time={start} />}
          </div>
          <h5>{description}</h5>
          {enabled === false && (
            <h1 className={style.cancelled}>This event has been cancelled</h1>
          )}
        </div>
        <SignupSheet
          event={event}
          userEvents={userEvents}
          setUserEvents={setUserEvents}
        />
      </div>
    </section>
  );
};

export default Event;
