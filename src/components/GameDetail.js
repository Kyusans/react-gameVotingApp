import axios from "axios";
import { useEffect, useState } from "react";
import { Button, Card, Col, Container, ListGroup, Modal, Row, Spinner } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import RateGame from "./RateGame";
import { LazyLoadImage } from 'react-lazy-load-image-component';
import 'react-lazy-load-image-component/src/effects/blur.css';
import "./../index.css";

const GameDetail = (props) => {
  const { show, onHide, selectedGameId } = props;
  const [gameName, setGameName] = useState("");
  const [gameDescription, setGameDescription] = useState("");
  const [gameIcon, setGameIcon] = useState("");
  // const [image, setImage] = useState([]);
  const [dev, setDev] = useState([]);
  const [loading, setLoading] = useState(false);

  const [showRateModal, setShowRateModal] = useState(false);
  
  const openRateModal = () => {
    setShowRateModal(true);
  };
  
  const closeRateModal = () => {
    handleHide();
    setShowRateModal(false);
  };

  function handleHide() {
    setGameName("");
    setGameDescription("");
    setGameIcon("");
    // setImage([]);
    setDev([]);
    onHide();
  }

  useEffect(() => {
    if (selectedGameId !== "" && show === true) {
      setLoading(true);
      const getDevs = () => {
        const url = localStorage.getItem("url") + "games.php";
        const jsonData = { gameId: selectedGameId };
        const formData = new FormData();
        formData.append("operation", "getDevs");
        formData.append("json", JSON.stringify(jsonData));
        axios({ url: url, data: formData, method: "post" })
        .then((res) => {
          if (res.data !== 0) {
            setDev(res.data);
          }
        })
        .catch((err) => {
          alert("There was an error occurred: " + err);
        });
      };

      const selectGame = () => {
        const url = localStorage.getItem("url") + "games.php";
        const jsonData = { gameId: selectedGameId };
        const formData = new FormData();
        formData.append("operation", "selectGame");
        formData.append("json", JSON.stringify(jsonData));
        axios({ url: url, data: formData, method: "post" })
        .then((res) => {
          if (res.data !== 0) {
            setGameName(res.data.game_name);
            setGameDescription(res.data.game_description);
            setGameIcon(res.data.game_icon);
          }
        })
        .catch((err) => {
          alert("There was an error occurred: " + err);
        });
      };

      // mga screenshot ni nila
      // const getImage = () => {
      //   const url = localStorage.getItem("url") + "games.php";
      //   const jsonData = { gameId: selectedGameId };
      //   const formData = new FormData();
      //   formData.append("operation", "getImage");
      //   formData.append("json", JSON.stringify(jsonData));
      //   axios({ url: url, data: formData, method: "post" })
      //   .then((res) => {
      //     if (res.data !== 0) {
      //       setImage(res.data);
      //     }
      //   })
      //   .catch((err) => {
      //     alert("There was an error occurred: " + err);
      //   });
      // };


      // eh butang ni sa promis.all getImage() if naay screenshot sa ilang dula
      Promise.all([getDevs(), selectGame()]).then(() => {
        setTimeout(() => {
          setLoading(false);
        }, 850);
      });
    }
  }, [selectedGameId, show]);

  return (
    <>
      <Modal show={show} onHide={onHide} size="lg" fullscreen>
        <Modal.Header>
          <Container className="d-flex justify-content-between">
            <Button
              variant="outline-danger"
              onClick={() => handleHide()}
              style={{ width: "75px" }}
            >
              <FontAwesomeIcon icon={faArrowLeft} />{" "}
            </Button>
            <Button variant="outline-success" onClick={openRateModal}>Rate Game</Button>
          </Container>
        </Modal.Header>
        <Modal.Body>
          {loading ? (
            <>
              <Container className="text-center mt-5">
                <Spinner variant="success" animation="border" />
              </Container>
            </>
          ) : (
            <>
              <Container className="text-center">
                <h1><b>{gameName}</b></h1><br />
                <Row>
                  <Col>
                    <LazyLoadImage
                    src={process.env.PUBLIC_URL + "/images/gameIcon/" + gameIcon}
                    alt={gameName + "'s Icon picture"}
                    className="fixed-aspect-ratio border-1"
                    effect="blur"
                  />
                  </Col>
                  <Col>
                    <Card className="text-white" bg="dark" border="dark">
                      <Card.Body><p>{gameDescription}</p></Card.Body>
                    </Card>
                    <Card className="mt-3" border="dark">
                    <Card.Footer><h4>Developer</h4></Card.Footer>
                    <ListGroup variant="flush">
                      {dev.map((devs, index) =>(<ListGroup.Item key={index}>{devs.dev_name}</ListGroup.Item>))}
                    </ListGroup>
                  </Card>
                  </Col>
                </Row>
              </Container>
              {/* <Container className="mt-3 text-center" style={{ maxWidth: "550px" }}>
                <Carousel>
                  {
                    image.map((images, index) =>(
                      <Carousel.Item key={index}>
                        <LazyLoadImage
                          src={process.env.PUBLIC_URL + "/images/screenshots/" + images.img_image}
                          className="minimum-height"
                          rounded
                          thumbnail
                          effect="blur" // Apply a blur effect
                        />
                      </Carousel.Item>                     
                    ))
                  } 
                </Carousel>
              </Container> */}
            </>
          )}
        </Modal.Body>
      </Modal>
      <RateGame show={showRateModal} onHide={closeRateModal} gameId={selectedGameId} />
    </>
  );
}

export default GameDetail;
