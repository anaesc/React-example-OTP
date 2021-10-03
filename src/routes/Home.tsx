import React, { useRef, useContext } from "react";
import Button from "../Button";
import ErrorDisplay from "../ErrorDisplay";
import CardForm from "../CardForm";
import testCards from "../utils/testCards";
import { AppContext } from "../context/AppContext";
import { navigate, RouteComponentProps } from "@reach/router";

import { kushki } from "../utils/services";

interface HomeProps extends RouteComponentProps {}

type Inputs = {
  cardNumber: string;
  cardName: string;
  expDate: string;
  cvc: string;
};

const chargeAmount = 1500; //OTP configurada para trx > 1000 USD
const chargeCurrency = "USD";

const Home: React.FC<HomeProps> = () => {
  const { state, setState } = useContext(AppContext);

  const cardFormRef = useRef<any>();

  const setValues = (type: "approved" | "declinedOnToken" | "declined") => {
    cardFormRef.current.setValues(
      testCards[type].cardNumber,
      testCards[type].cardName,
      testCards[type].expDate,
      testCards[type].cvc
    );
  };

  const onSubmit = async (data: Inputs) => {
    setState((state: any) => ({
      ...state,
      loading: true,
      currentOperation: "auth"
    }));

    kushki.requestToken(
      {
        amount: chargeAmount,
        currency: chargeCurrency,
        card: {
          name: data.cardName,
          number: data.cardNumber.replace(/ /g, ""),
          cvc: data.cvc,
          expiryMonth: data.expDate.split("/")[0],
          expiryYear: data.expDate.split("/")[1]
        }
      },
      (response: any) => {
        if (!response.code && response.secureId) {
          setState((state: any) => ({
            ...state,
            token: response.token,
            secureId: response.secureId
          }));

          setState((state: any) => ({
            ...state,
            loading: false
          }));

          navigate("/otp");
        } else {
          setState((state: any) => ({
            ...state,
            loading: false,
            error: response.message
          }));
        }
      }
    );
  };

  return (
    <>
      <CardForm
        loading={state.loading}
        onSubmit={onSubmit}
        chargeAmount={chargeAmount}
        ref={cardFormRef}
      />

      <div className="text-center">
        <div className="test-data">
          <span className="test-data__title">Datos de prueba</span>
          <Button
            className="option-button"
            onClick={() => setValues("approved")}
          >
            Transacción aprobada
          </Button>
          <Button
            className="option-button"
            onClick={() => setValues("declinedOnToken")}
          >
            Transacción declinada en solicitud de token
          </Button>
          <Button
            className="option-button"
            onClick={() => setValues("declined")}
          >
            Transacción declinada
          </Button>
        </div>

        {state.token && (
          <div style={{ marginTop: "1rem" }}>
            <b>Token obtenido:</b> {state.token}
            <br />
            <b>SecureId obtenido:</b> {state.secureId}
          </div>
        )}
      </div>

      <ErrorDisplay />
    </>
  );
};

export default Home;
