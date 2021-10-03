import React, { useContext, useState } from "react";

import Button from "../Button";
import { AppContext } from "../context/AppContext";
import ErrorDisplay from "../ErrorDisplay";
import { exampleAPI, kushki } from "../utils/services";

import otpImage from "../images/otp.png";

import OtpInput from "react-otp-input";
import { ArrowLeft } from "@kushki/suka-react-system-icons";
import { navigate, RouteComponentProps } from "@reach/router";

interface OTPProps extends RouteComponentProps {}

const chargeAmount = 1500;

const OTP: React.FC<OTPProps> = () => {
  const { state, setState } = useContext(AppContext);
  const [otp, setOtp] = useState("");

  const handleChange = (otp: string) => {
    setOtp(otp);

    if (otp.length === 3) {
      setState((state: any) => ({
        ...state,
        loading: true,
        currentOperation: "otp"
      }));

      kushki.requestSecureServiceValidation(
        {
          secureServiceId: state.secureId,
          otpValue: otp
        },
        (response: any) => {
          if (!response.error) {
            console.log(response);

            exampleAPI
              .post("/chargeOtp", {
                amount: chargeAmount,
                token: state.token
              })
              .then((response) => {
                console.log(response.data);
                setState((state: any) => ({
                  ...state,
                  chargeResponse: response.data
                }));
                navigate("/result");
              })
              .catch((error) => {
                if (error.response) {
                  setState((state: any) => ({
                    ...state,
                    error: error.response.data.message
                  }));
                } else {
                  console.error(error);
                }
              })
              .finally(() => {
                setState((state: any) => ({
                  ...state,
                  loading: false
                }));
              });
          } else {
            console.log(response);
            setState((state: any) => ({
              ...state,
              loading: false,
              error: response.message
            }));
          }
        }
      );
    }
  };

  const handleBack = () => {
    navigate("/");
  };

  return (
    <>
      <div className="otp-wrapper">
        <div className="otp-wrapper__header">
          {!state.loading && (
            <ArrowLeft onClick={handleBack} className="back-button" />
          )}
          <h4>Código de verificación</h4>
        </div>
        <div className="otp-wrapper__body">
          <p>
            Por favor ingresa el código de seguridad de 3 dígitos
            correspondiente al <b>monto que acabamos de cobrar en tu tarjeta</b>
            .
          </p>
          <img src={otpImage} alt="otp example" className="otp-example" />
          <p className="notice">Este cobro se anulará de manera automática</p>

          <div className="otp-code">
            {state.loading && (
              <>
                <div className="otp-code__loading-backdrop" />
                <div className="otp-loading-message">
                  <div className="spinner spinner--blue"></div> Verficando...
                </div>
              </>
            )}
            <OtpInput
              numInputs={3}
              value={otp}
              onChange={handleChange}
              inputStyle="otp-code__input"
              shouldAutoFocus={true}
              isInputNumber={true}
              hasErrored={state.error}
              errorStyle="otp-code__input--error"
            />
          </div>
        </div>
      </div>
      <div className="text-center">
        <div className="test-data">
          <span className="test-data__title">Datos de prueba</span>
          <Button className="option-button" onClick={() => handleChange("155")}>
            OTP Válido
          </Button>
          <Button className="option-button" onClick={() => handleChange("123")}>
            OTP Inválido
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

export default OTP;
