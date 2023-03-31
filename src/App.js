import React from "react";
import { Router, Route, Switch } from "react-router-dom";
import { Container } from "reactstrap";

import Loading from "./components/Loading";
import NavBar from "./components/NavBar";
import Footer from "./components/Footer";
import Home from "./views/Home";
import Profile from "./views/Profile";
import CodeView from "./views/CodeView";
import { useAuth0 } from "@auth0/auth0-react";
import history from "./utils/history";

// styles
import "./App.css";

const App = () => {
  const { isLoading, error } = useAuth0();

  if (error) return <div>Oops... {error.message}</div>;
  if (isLoading) return <Loading />;

  return (
    <Router history={history}>
      <div id="app">
        <NavBar />
        <Container>
          <Switch>
            <Route path="/" exact component={Home} />
            <Route path="/profile" component={Profile} />
            <Route path="/codeView" component={CodeView} />
          </Switch>
        </Container>
        <Footer />
      </div>
    </Router>
  );
};

export default App;
