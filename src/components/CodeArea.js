import React from "react";
import Editor from "@monaco-editor/react";
import { ThemeContext } from "../context/ThemeContext";

class CodeArea extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <ThemeContext.Consumer>
        {(darkTheme) => (
          <div className="border-solid border border-[#35472d]">
            <Editor
              height="90vh"
              defaultLanguage="typescript"
              value={this.props.value}
              theme="vs-dark"
              onChange={this.props.onChange}
            />
          </div>
        )}
      </ThemeContext.Consumer>
    );
  }
}

export default CodeArea;
