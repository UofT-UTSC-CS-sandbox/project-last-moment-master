import React, { useEffect, useState } from "react";
import { Container, Row, Col } from "reactstrap";
import Loading from "../components/Loading";
import { useAuth0, withAuthenticationRequired } from "@auth0/auth0-react";
import Switch from "../components/ThemeSwitch";
import { ThemeContext } from "../context/ThemeContext";

export const ProfileComponent = () => {
  const { user } = useAuth0();
  const [darkTheme, setDarkTheme] = useState(false);

  const handleTheme = () => {
    setDarkTheme(!darkTheme);
  };

  useEffect(() => {
    // Get the value of the "darkTheme" key from local storage
    const storedDarkTheme = localStorage.getItem("darkTheme");

    // If the value exists in local storage, use it to set the state
    if (storedDarkTheme !== null) {
      setDarkTheme(JSON.parse(storedDarkTheme));
    }
  }, []);

  useEffect(() => {
    // Store the value of the "darkTheme" key in local storage whenever it changes
    localStorage.setItem("darkTheme", JSON.stringify(darkTheme));
  }, [darkTheme]);

  return (
    <Container className="mb-5">
      <Row className="align-items-center profile-header mb-5 text-center text-md-left">
        <Col md={2}>
          <img
            src={user.picture}
            alt="Profile"
            className="rounded-circle img-fluid profile-picture mt-28 ml-8 mb-3 mb-md-0 hover:#334155"
            style={{
              borderRadius: "50%",
              maxWidth: "150px",
              maxHeight: "150px",
            }}
          />
        </Col>
      </Row>
      <Row className="mb-8">
        <button
          // formtype="submit"
          // onClick=
          className="bg-[#85ab70] hover:bg-[#527642] text-[#e1ecdb] font-bold rounded-lg px-6 py-3 drop-shadow-xl left-40"
        >
          {/* not impelmented yet */}
          Change profile picture
        </button>
        <div className="bg-[#a5c392] rounded-lg w-64 h-48 px-4 ring-1 ring-[#588742] shadow-xl">
          <h2 className="text-[#345427] text-lg mt-8 font-bold font-mono text-center">
            {user.nickname}
          </h2>
          <p className="lead text-muted text-[#345427] font-bold font-mono left-40">
            {user.email}
          </p>
        </div>
        <div>
          <ThemeContext.Provider value={darkTheme}>
            <Switch checked={darkTheme} onChange={handleTheme} />
            <h3 className="text-[#c8dabc] font-bold font-mono">Dark mode</h3>
          </ThemeContext.Provider>
        </div>
      </Row>
    </Container>
  );
};

export default withAuthenticationRequired(ProfileComponent, {
  onRedirecting: () => <Loading />,
});
