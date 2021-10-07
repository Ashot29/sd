import React, { Suspense } from "react";
import Nav from "./components/nav";
import Main from "./components/main";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import "./App.css";

const Users = React.lazy(() => import("./components/users"));

function App() {
  return (
    <Router>
      <Nav />
      <Switch>
        <Route exact path="/">
          <Main />
        </Route>
        <Route path="/users">
          <Suspense fallback={<div className="loading-div">Loading...</div>}>
            <Users />
          </Suspense>
        </Route>
      </Switch>
    </Router>
  );
}

export default App;
