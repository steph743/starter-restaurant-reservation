import React from "react";

import { Redirect, Route, Switch } from "react-router-dom";
import Dashboard from "../dashboard/Dashboard";
import NotFound from "./NotFound";
import { today } from "../utils/date-time";
import ReservationRoutes from "../reservations/routes"
import CreateTable from "../tables/create";
import SearchReservation from "../reservations/search";

/**
 * Defines all the routes for the application.
 *
 * You will need to make changes to this file.
 *
 * @returns {JSX.Element}
 */
function Routes() {
  return (
    <Switch>
      <Route exact path="/">
        <Redirect to={"/dashboard"} />
      </Route>
      <Route path = "/search">
      <SearchReservation />
      </Route>
      <Route path = "/reservations">
      <ReservationRoutes />
      </Route>
      <Route path="/dashboard">
        <Dashboard date={today()} />
      </Route>
      <Route exact={true} path={`/tables/new`}>
            <CreateTable />
        </Route>
      <Route>
        <NotFound />
      </Route>
    </Switch>
  );
}

export default Routes;
