import axios from "axios";
import { Button, Card, Row, Col, Modal, Container } from "react-bootstrap";
import { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import AlertScript from "./AlertScript";
import "../index.css";

const AdminSettings = (props) => {
  const {show, onHide} = props;
  const [rateStatus, setRateStatus] = useState(false);
  const [revealStatus, setRevealStatus] = useState(false);
  //for alert
  const [showAlert, setShowAlert] = useState(false);
  const [alertVariant, setAlertVariant] = useState("");
  const [alertMessage, setAlertMessage] = useState("");
  function getAlert(variantAlert, messageAlert, status = ""){
    setShowAlert(true);
    setAlertVariant(variantAlert);
    setAlertMessage(messageAlert);
  }

  useEffect(() =>{
    if(show === true){
      const getRatingStatus = () =>{
        const url = localStorage.getItem("url") + "settings.php";
        const formData = new FormData();
        formData.append("operation", "getRatingStatus");
        axios({url: url, data: formData, method:"post"})
        .then(res =>{
          if(res.data === 1){
            setRateStatus(true);
          }else{
            setRateStatus(false);
          }
        }).catch(err =>{
          getAlert("danger", "There was an unexpected error occured: " + err);
        })
      }
      const getRevealStatus = () =>{
        const url = localStorage.getItem("url") + "settings.php";
        const formData = new FormData();
        formData.append("operation", "getRevealStatus");
        axios({url: url, data: formData, method:"post"})
        .then(res =>{
          if(res.data === 1){
            setRevealStatus(true);
          }else{
            setRevealStatus(false);
          }
        }).catch(err =>{
          getAlert("danger", "There was an unexpected error occured: " + err);
        })
      } 
      function checkStatus(){
        getRatingStatus();
        getRevealStatus();
      }
      checkStatus();
    }
  },[revealStatus, rateStatus, show])

  const setRating = (status) =>{
    const url = localStorage.getItem("url") + "settings.php";
    const jsonData = {status: status}
    const formData = new FormData();
    formData.append("operation", "setRatingStatus");
    formData.append("json", JSON.stringify(jsonData));

    axios({url: url, data: formData, method:"post"})
    .then(res =>{
      if(res.data !== 0){
        if(status === 1){
					getAlert("success", "Success! rating status is now: can rate");
          setRateStatus(true);
				}else{
					getAlert("success", "Success! rating status is now: can't rate");
          setRateStatus(false);
				}
        setTimeout(() => {
          setShowAlert(false)
        },1500)
      }else{
        if(status === 1){
					getAlert("danger", "rating status is already: can rate");
				}else{
					getAlert("danger", "rating status is already: can't rate");
				}
        setTimeout(() => {
          setShowAlert(false)
        },1500)
      }
    }).catch(err =>{
      getAlert("danger", "There was an unexpected error occured: " + err);
    })
  }

	const setReveal = (status) =>{
		const url = localStorage.getItem("url") + "settings.php";
    const jsonData = {status: status}
    const formData = new FormData();
    formData.append("operation", "setRevealStatus");
    formData.append("json", JSON.stringify(jsonData));
    axios({url: url, data: formData, method:"post"})
    .then(res =>{
      if(res.data !== 0){
        if(status === 1){
					getAlert("success", "Success! reveal status is now: revealed");
          setRevealStatus(true);
				}else{
					getAlert("success", "Success! reveal status is now: hidden");
          setRevealStatus(false);
				}
        setTimeout(() => {
          setShowAlert(false)
        },3000)
      }else{
        if(status === 1){
					getAlert("danger", "reveal status is already: revealed");
				}else{
					getAlert("danger", "reveal status is already: hidden");
				}
        setTimeout(() => {
          setShowAlert(false)
        },1500)
      }
    }).catch(err =>{
      getAlert("danger", "There was an unexpected error occured: " + err);
    })
	}

  return ( 
    <>
      <Modal show={show} onHide={onHide} fullscreen={true}>
        <Modal.Header>
          <Button variant="outline-danger" onClick={onHide} style={{ width: "75px" }}><FontAwesomeIcon icon={faArrowLeft} /> </Button>
        </Modal.Header>
        <Modal.Body>
          <Card className="small-card mt-2" bg="dark">
            <Card.Body className="text-center">
              <Row>
                <Col className="d-flex justify-content-between align-items-center">
                  <Button onClick={() => setRating(1)}>Start rate</Button>
                  <Button className="btn-danger" onClick={() => setRating(0)}>Stop Rate</Button>
                </Col>
              </Row>
              <Row>
                <Col className="d-flex justify-content-between align-items-center mt-3">
                  <Button onClick={() => setReveal(1)}>Reveal game name</Button>
                  {" "}
                  <Button className="btn-danger ms-4" onClick={() => setReveal(0)}>Unreveal game name</Button>
                </Col>
              </Row>
            </Card.Body>
          </Card>
          <Card className="small-card mt-2" bg="dark">
            <Card.Body className="text-center text-white">
              <Row className="d-flex justify-content-between align-items-center">
                <Col>
                  Rate status: <br /><b>{rateStatus ? <h6 className="text-success">can rate</h6> : <p className="text-secondary">can't rate</p>}</b> 
                </Col>
                <Col>
                  Reveal status: <br /><b>{revealStatus ? <h6 className="text-success">revealed</h6> : <p className="text-secondary">hidden</p>}</b>
                </Col>
              </Row>
            </Card.Body>
          </Card>
          <Container className="text-center w-50 mt-3">
            <AlertScript show={showAlert} variant={alertVariant} message={alertMessage} />
          </Container>
        </Modal.Body>
      </Modal>
    </> 
  );
}
 
export default AdminSettings;