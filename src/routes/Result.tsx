import React, { useContext } from "react";
import Button from "../Button";
import axios from "axios";
import { AppContext } from "../context/AppContext";

import { RouteComponentProps, useNavigate } from "@reach/router";

interface ResultProps extends RouteComponentProps {}

const Result: React.FC<ResultProps> = () => {
  const { state, setState } = useContext(AppContext);
  const navigate = useNavigate();

  const resetExample = () => {
    setState({
      currentOperation: "token",
      loading: false
    });
    navigate("/");
  };

  return (
    <>
      <div className="success-wrapper">
        <div className="success-icon">✓</div>
        <p className="success-title">Cobro exitoso</p>
        <pre className="success-code">
          <code>{JSON.stringify(state.chargeResponse, null, 2)}</code>
        </pre>

        <Button
          className="option-button"
          onClick={resetExample}
          disabled={state.loading}
        >
          Reiniciar ejemplo
        </Button>
      </div>
    </>
  );
};

export default Result;
