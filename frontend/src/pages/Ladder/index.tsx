import React from "react";

import Ranks from "pages/Ladder/ranks";
import Matches from "pages/Ladder/matches";

interface IProps {
  ladderid: number;
}

const Ladder = ({ ladderid }: IProps) => {
  //const { ladderid } = useParams<ParamTypes>();

  return (
    <>
      <Ranks ladderid={ladderid} />
      <Matches ladderid={ladderid} challenges={true} />
      <Matches ladderid={ladderid} challenges={false} />
    </>
  );
};

export default Ladder;
