import React from "react";
import pageStyle from "styles/pages.module.scss";

import Ladder from "pages/Ladder";

const Competition = () => {
  return (
    <section className={pageStyle.area}>
      <div className={pageStyle.child}>
        <Ladder ladderid={1} />
      </div>
    </section>
  );
};

export default Competition;
