import React from "react";
import { Container, Row, Col } from "reactstrap";

import Loading from "../components/Loading";
import { useAuth0, withAuthenticationRequired } from "@auth0/auth0-react";

export const ProfileComponent = () => {
  const { user } = useAuth0();

  return (
    <Container className="mb-5">
      <Row className="align-items-center profile-header mb-5 text-center text-md-left">
        <Col md={2}>
          <img
            src={user.picture}
            alt="Profile"
            className="rounded-circle img-fluid profile-picture mt-28 ml-8 mb-3 mb-md-0"
            style={{ borderRadius: "50%", maxWidth: "150px", maxHeight: "150px" }}
          />
        </Col>
        <Col md>
          <h2 className="text-[#e1ecdb] ml-8 font-bold font-mono">{user.nickname}</h2>
          <p className="lead text-muted text-[#e1ecdb] font-bold font-mono">{user.email}</p>
        </Col>
      </Row>
      <Row>
        <div className="text-[#e1ecdb] font-bold font-mono">{JSON.stringify(user, null, 2)}</div>
      </Row>
    </Container>
  );
};

export default withAuthenticationRequired(ProfileComponent, {
  onRedirecting: () => <Loading />,
});
