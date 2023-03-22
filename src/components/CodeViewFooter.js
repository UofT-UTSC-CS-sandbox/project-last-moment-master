import React from "react";

class CodeViewFooter extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      menuVisible: false,
    };
    this.toggleMenu = this.toggleMenu.bind(this);
  }

  toggleMenu() {
    this.setState((prevState) => ({
      menuVisible: !prevState.menuVisible,
    }));
  }

  render() {
    return (
      <div id="outcome" className="relative">
        {!this.state.menuVisible && (
          <button
            formType="submit"
            onClick={this.toggleMenu}
            className="bg-[#85ab70] hover:bg-[#527642] text-[#e1ecdb] font-bold rounded-lg px-6 py-3 drop-shadow-xl fixed bottom-20 left-32"
          >
            Submit
          </button>
        )}

        {this.state.menuVisible && (
          <div className="absolute bottom-full left-0 right-0 bg-[#e1ecdb] p-2 h-60 shadow-lg border-solid border-2 border-[#35472d]">
            <p>Running results goes here</p>
            <button
              onClick={this.toggleMenu}
              className="bg-[#85ab70] hover:bg-[#527642] text-[#e1ecdb] font-bold rounded-lg px-6 py-3 drop-shadow-xl fixed bottom-20 left-32"
            >
              Close
            </button>
          </div>
        )}
      </div>
    );
  }
}

export default CodeViewFooter;
