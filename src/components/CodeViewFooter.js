import React, { useState, useCallback } from "react";
import { getConfig } from "../config";
import { useAuth0 } from "@auth0/auth0-react";

export const CodeViewFooter = (props) => {
  const { value } = props;

  const { apiOrigin = "https://skillvitrine.wlt.life:3001" } = getConfig();
  const { getAccessTokenSilently } = useAuth0();

  const [state, setState] = useState({
    menuVisible: false,
    data: "Running results goes here",
  });

  const callApi = useCallback(async () => {
    const token = await getAccessTokenSilently();
    const response = await fetch(`${apiOrigin}/api/execute`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ code: value }),
    });
    const responseData = await response.json();
    return responseData;
  }, [getAccessTokenSilently, apiOrigin, value]);

  const toggleMenu = async () => {
    if (state.menuVisible) {
      setState((prevState) => ({
        menuVisible: !prevState.menuVisible,
        data: prevState.data,
      }));
      return;
    }
    try {
      const responseData = await callApi();
      setState((prevState) => ({
        menuVisible: !prevState.menuVisible,
        data: responseData.results,
      }));
    } catch (error) {
      setState((prevState) => ({
        menuVisible: !prevState.menuVisible,
        data: prevState.data,
      }));
    }
  };

  return (
    <div id="outcome" className="relative">
      {!state.menuVisible && (
        <button
          formtype="submit"
          onClick={() => toggleMenu()}
          className="bg-[#85ab70] hover:bg-[#527642] text-[#e1ecdb] font-bold rounded-lg px-6 py-3 drop-shadow-xl fixed bottom-20 left-32"
        >
          Submit
        </button>
      )}

      {state.menuVisible && (
        <div className="absolute bottom-full left-0 right-0 bg-[#e1ecdb] p-2 h-60 shadow-lg border-solid border-2 border-[#35472d]">
          <p>{state.data}</p>
          <button
            onClick={() => toggleMenu()}
            className="bg-[#85ab70] hover:bg-[#527642] text-[#e1ecdb] font-bold rounded-lg px-6 py-3 drop-shadow-xl fixed bottom-20 left-32"
          >
            Close
          </button>
        </div>
      )}
    </div>
  );
};

export default CodeViewFooter;
