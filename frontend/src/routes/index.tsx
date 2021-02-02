import React from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import Base from "components/Base";
import Home from "pages/Home";
import Social from "pages/Social";
import Competition from "pages/Competition";
import Event from "pages/Event";
import { StylesProvider } from "@material-ui/core/styles";
import ComingSoon from "pages/ComingSoon";

const Routes = () => (
  <Router>
    <StylesProvider injectFirst>
      <Base>
        <Switch>
          <Route exact path="/">
            <Home />
          </Route>
          <Route exact path="/social">
            <Social />
          </Route>
          <Route path="/event/:eventid">
            <Event />
          </Route>
          <Route exact path="/competition">
            <Competition />
          </Route>
          <Route path="/competition/:comp">
            <Competition />
          </Route>

          <Route path="/competition/ladder/:ladderid">
            <Competition />
          </Route>
          <Route path="/coaching">
            <ComingSoon />
          </Route>
          <Route path="/shop">
            {" "}
            <ComingSoon />
          </Route>
        </Switch>
      </Base>
    </StylesProvider>
  </Router>
);

export default Routes;
