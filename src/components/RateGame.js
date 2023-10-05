import axios from "axios";
import { useState } from "react";
import { Modal, Button, Row, Col, Spinner } from "react-bootstrap";
import Rating from "react-rating-stars-component";
import AlertScript from "./AlertScript";
import "../index.css"

const RateGame = (props) => {
    const {show, onHide, gameId } = props;
    const [star, setStar] = useState(0);
    const [isLoading, setIsloading] = useState(false);
    //for alert
    const [showAlert, setShowAlert] = useState(false);
    const [alertVariant, setAlertVariant] = useState("");
    const [alertMessage, setAlertMessage] = useState("");


    function getAlert(variantAlert, messageAlert){
      setShowAlert(true);
      setAlertVariant(variantAlert);
      setAlertMessage(messageAlert);
    }

    const handleRating = (value) => {
      setStar(value);
    };

    const addStar = () =>{
      const url = localStorage.getItem("url") + "games.php";
      const jsonData = {gameId: gameId, schoolId: 1, stars: star}
      const formData = new FormData();
      formData.append("operation", "addStar");
      formData.append("json", JSON.stringify(jsonData));
      axios({url: url, data: formData, method:"post"})
      .then((res) =>{
        console.log("RES NI ADDSTAR: " + JSON.stringify(res.data));
        if(res.data === 3){
          getAlert("danger", "You have already rated this game.");
        }else if(res.data === 1){
          getAlert("success", `You rated ${star} stars`)
          setTimeout(() => {
            handleHide();
          }, 1250);
        }else{
          getAlert("danger", "There was an unexpected error");
        }
      })

      .catch((err) =>{
        getAlert("danger", "There was an unexpected error: " + err);
      })
    }

    const checkStatus = async () =>{
      if(star === 0){
        getAlert("danger", "Rate atleast 1 star");
      }else{
        const url = localStorage.getItem("url") + "settings.php";
        const formData = new FormData();
        formData.append("operation", "getRatingStatus");
        try {
          const res = await axios({url: url, data: formData, method: "post"});
          console.log("res.data" + JSON.stringify(res.data))
          if(res.data !== "0"){
            setIsloading(true);
            addStar();
          }else{    
            getAlert("danger", "Rating unavailable");
          }
        }catch(err) {
          getAlert("danger","There was an unexpected error occured: ", err)
        }
      }
    }

    function handleHide(){
      setShowAlert(false);
      setStar(0);
      setIsloading(false);
      onHide();
    }

  return ( 
    <>
      <Modal show={show} onExited={onHide} variant="success">
        <Modal.Header>
          <Modal.Title>Rate this game</Modal.Title>
        </Modal.Header>

        <Modal.Body>               
          <Row className="text-center">
            <Col>
              <AlertScript show={showAlert} variant={alertVariant} message={alertMessage} />
              You can rate as many games as you want <br />
              You can rate a specific game only once <br />
              You can not update your ratings
            </Col>          
          </Row>
          <Row>
            <div className="rating-container text-center">
              <Rating count={5} size={50} activeColor="#ffd700" value={star} onChange={handleRating}/>
            </div>
          </Row>
        </Modal.Body>

        <Modal.Footer>
          <Button variant="outline-danger" onClick={() => handleHide()}>Close</Button>
          {isLoading ? <Button disabled variant="outline-success"><Spinner size="sm" /> </Button> :
          <Button variant="outline-success" onClick={checkStatus}>Submit</Button>}
        </Modal.Footer>
      </Modal>
    </>
  );
}
 
export default RateGame;