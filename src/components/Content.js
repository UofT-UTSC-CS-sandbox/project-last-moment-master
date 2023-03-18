import React, { Component } from "react";
import bgImage from "../assets/code_background.jpeg";

class Content extends Component {
  componentDidMount() {
    // Set the background image on the body element
    document.body.style.backgroundImage = `url(${bgImage})`;
    document.body.style.backgroundSize = 'cover';
    document.body.style.backgroundPosition = 'center center';
    document.body.style.backgroundRepeat = 'no-repeat';
    document.body.style.minHeight = '100vh';
  }
  render() {
    return (
      <div>
        <h1 className="my-5 text-center mt-80 text-6xl text-[#f2f6ef] font-bold font-mono">
          Welcome to Skillvitrine
        </h1>
        <h2 className="my-5 text-center text-3xl text-[#f2f6ef] font-bold font-mono">
          A place to showcase your skills
        </h2>
      </div>
    );
  }
}

export default Content;
