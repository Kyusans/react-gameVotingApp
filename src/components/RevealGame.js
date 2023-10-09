import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import axios from "axios";
import { useEffect, useState } from "react";
import { Button, Container, Image, Spinner, Modal, Row, Col, Card, ListGroup} from "react-bootstrap";
import 'react-lazy-load-image-component/src/effects/blur.css';
import '../index.css';

const RevealGame = (props) => {
  const [gameName, setGameName] = useState("");
  const [gameIcon, setGameIcon] = useState("");
  const [dev, setDev] = useState([]);
  const [loading, setLoading] = useState(false);
  const { show, onHide, selectedGameId } = props;

  function handleHide() {
    setGameName("");
    setGameIcon("");
    setDev([]);
    onHide();
  }

  useEffect(() => {
    if (selectedGameId !== "" && show === true) {
      setLoading(true);

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
              setGameIcon(res.data.game_icon);
            }
          })
          .catch((err) => {
            alert("There was an error occurred: " + err);
          });
      };

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

      Promise.all([selectGame(), getDevs()]).then(() => {
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
          <Container className="mt-3 d-flex justify-content-between">
            <Button
              variant="outline-danger"
              onClick={() => handleHide()}
              style={{ width: "75px" }}
            >
              <FontAwesomeIcon icon={faArrowLeft} />{" "}
            </Button>
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
                <Row>     
                  <h1><b>{gameName}</b></h1><br />
                </Row>
                <Row className="mt-3">
                  <Col xs={6}>
                    <Image
                      src={process.env.PUBLIC_URL + "/images/gameIcon/" + gameIcon}
                      alt={gameName + "'s Icon picture"}
                      className="fixed-aspect-ratio border-1"
                      fluid
                    />
                  </Col>
                  <Col xs={6}>
                  <Card border="dark">
                    <Card.Footer><h3>Developer</h3></Card.Footer>
                    <ListGroup variant="flush">
                      {dev.map((devs, index) =>(<ListGroup.Item key={index}><h4><b>{devs.dev_name}</b></h4></ListGroup.Item>))}
                    </ListGroup>
                  </Card>
                  </Col>
                </Row>
              </Container>
            </>
          )}
        </Modal.Body>
      </Modal>
    </>
  );
}

export default RevealGame;
