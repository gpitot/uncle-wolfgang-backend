import React, { useEffect, useState, useContext } from "react";
import { UserContext } from "contexts/UserContext";

import API from "rest/api";
import { IRanks } from "rest/ladder";
import List from "components/List";
import UserRow from "components/UserRow";
import Button from "components/Button";
import { toast } from "react-toastify";

interface IProps {
  ladderid: number;
}

const Ranks = ({ ladderid }: IProps) => {
  //const { ladderid } = useParams<ParamTypes>();
  const { user } = useContext(UserContext);
  const [ranks, setRanks] = useState<Array<IRanks>>([]);
  const [challenged, setChallenged] = useState<Array<string>>([]);

  useEffect(() => {
    if (ladderid === undefined) return;
    API.ladder
      .getRanks({
        ladder_id: ladderid,
      })
      .then((res) => {
        console.log(res);
        if (res.success) {
          setRanks(res.result);
        }
      });
  }, [ladderid]);

  const challengeUser = (player_id: string) => {
    setChallenged([...challenged, player_id]);
    API.ladder
      .challengeUser({
        ladder_id: ladderid,
        player_2: player_id,
      })
      .then((res) => {
        if (res.success) {
          //show flag
          toast.success("Challenged player");
        } else {
          throw Error();
        }
      })
      .catch(() => {
        //error flag
        toast.error("Could not challenge player");
      });
  };

  // if (ladderid === undefined) {
  //   return <Redirect to="/" />;
  // }

  const body = ranks.map(({ player_id, firstname, photo }, rank) => {
    return [
      rank + 1,
      <UserRow name={firstname} photo={photo} />,
      <>
        {user && user.id !== player_id && (
          <Button
            disabled={challenged.includes(player_id)}
            handleClick={() => challengeUser(player_id)}
            text={"Challenge"}
          />
        )}
      </>,
    ];
  });

  return (
    <>
      <List title="Ranks" headers={["Rank", "Player", ""]} body={body} />
    </>
  );
};

export default Ranks;
