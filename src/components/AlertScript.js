import { useState, useEffect } from "react";
import { Alert } from "react-bootstrap";

const AlertScript = (props) => {
  const { show, variant, message } = props;

  const [handleShow, setHandleShow] = useState(false);

  const handleCloseAlert = () => {
    setHandleShow(false);
  };

  useEffect(() => {
    setHandleShow(show);
  }, [show]);

  return (
    <>
      <Alert variant={variant} show={handleShow} onClose={handleCloseAlert} className="text-center">
        {message}
      </Alert>
    </>
  );
};

export default AlertScript;

// import AlertScript from "./AlertScript";

// 	//for alert
// 	const [showAlert, setShowAlert] = useState(false);
// 	const [alertVariant, setAlertVariant] = useState("");
// 	const [alertMessage, setAlertMessage] = useState("");


// 	function getAlert(variantAlert, messageAlert){
// 		setShowAlert(true);
// 		setAlertVariant(variantAlert);
// 		setAlertMessage(messageAlert);
// 	}

// <AlertScript show={showAlert} variant={alertVariant} message={alertMessage} />