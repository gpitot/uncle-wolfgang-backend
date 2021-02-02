import React from "react";
import List from "components/List";
import { IMatches } from "rest/ladder";
import UserRow from "components/UserRow";
import EventDate from "components/EventDate";

interface IProps {
  matches: Array<IMatches>;
}

const Results = ({ matches }: IProps) => {
  const body = matches.map(
    ({
      player_1_firstname,
      player_1_photo,
      player_2_firstname,
      player_2_photo,
      match_date,
      player_2_games,
      player_1_games,
    }) => [
      <UserRow name={player_1_firstname} photo={player_1_photo} />,
      <UserRow name={player_2_firstname} photo={player_2_photo} />,
      <span>
        {player_1_games} - {player_2_games}
      </span>,
      <span>
        <EventDate time={match_date} />
      </span>,
    ]
  );
  return (
    <List
      title="Results"
      headers={["Challenger", "Opponent", "Result", "Date"]}
      body={body}
    />
  );
};

export default Results;
