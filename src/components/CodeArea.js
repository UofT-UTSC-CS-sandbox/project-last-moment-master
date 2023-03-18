import React, { Component } from "react";
import ReactDom from "react-dom";
import sharedb from "sharedb/lib/client";
import Editor from "@monaco-editor/react";

const port = process.env.API_PORT || 3002;
const socket = new WebSocket(`ws://localhost:${port}`);
const connection = new sharedb.Connection(socket);

class CodeArea extends React.Component {
  constructor(props) {
    super(props);
    this.state = { content: "" };
  }

  componentDidMount = () => {
    const doc = connection.get("examples", "textarea");
    doc.subscribe((err) => {
      if (err) throw err;
      this.setState({ content: doc.data.content });
    });
    doc.on("op", () => {
      this.setState({ content: doc.data.content });
    });
    this.doc = doc;
  };

  handleChange = (value) => {
    this.doc.submitOp([{ p: ["content"], ld: this.doc.data[0], li: value }]);
    this.setState({ content: value });
  };

  render() {
    return (
      <div>
        <Editor
          height="90vh"
          defaultLanguage="typescript"
          value={this.state.content}
          onChange={this.handleChange}
        />
      </div>
    );
  }
}

export default CodeArea;
