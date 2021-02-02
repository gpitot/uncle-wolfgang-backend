import React, { useEffect, useState } from "react";
import API from "rest/api";
import { IMatches } from "rest/ladder";

import Challenges from "pages/Ladder/challenges";
import Results from "pages/Ladder/results";

interface IProps {
  ladderid: number;
  challenges: boolean;
}
const Matches = ({ ladderid, challenges }: IProps) => {
  const [matches, setMatches] = useState<Array<IMatches>>([]);

  useEffect(() => {
    API.ladder
      .getMatches({
        ladder_id: ladderid,
        challenges,
      })
      .then((res) => {
        if (res.success) {
          setMatches(res.result);
        }
      });
  }, [challenges, ladderid]);

  return (
    <>
      {challenges ? (
        <Challenges matches={matches} />
      ) : (
        <Results matches={matches} />
      )}
    </>
  );
};

/*
{
"id": 3,
"player_1": "115262183883716650482",
"player_2": "106578756968220466564",
"match_date": null,
"player_2_games": null,
"player_1_games": null,
"player_1_paid": false,
"player_2_paid": false,
"approved": false,
"accepted": false,
"player_1_firstname": "Breanna",
"player_1_lastname": "Banzer",
"player_1_photo": "https://lh3.googleusercontent.com/-RALo2BkwYX0/AAAAAAAAAAI/AAAAAAAAAAA/AMZuuckCaCAHutYwl0fije6OSmYL_ddQmQ/s96-c/photo.jpg",
"player_2_firstname": "Guillaume",
"player_2_lastname": "Pitot",
"player_2_photo": "https://lh3.googleusercontent.com/a-/AOh14Gjf6Tl5OhqbcYaayFMxI0dblZRO7AQFjgGKEGsjQg=s96-c"
},
*/

export default Matches;
