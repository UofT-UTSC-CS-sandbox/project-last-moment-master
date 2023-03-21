import React from "react";

class DescArea extends React.Component {
  render() {
    return (
      <div className="bg-scroll bg-[#f2f6ef] dark:bg-[#2e3e29] w-full h-full border-solid border border-[#35472d]">
        <h1
          className="text-center text-[#35472d] dark:text-[#f2f6ef] text-3xl font-bold font-mono"
          id="title"
        >
          Interview Question
        </h1>
        <h2
          className="text-center text-[#35472d] dark:text-[#f2f6ef] text-xl font-bold font-mono"
          id="question-desc"
        >
          Question description...
        </h2>
      </div>
    );
  }
}

export default DescArea;
