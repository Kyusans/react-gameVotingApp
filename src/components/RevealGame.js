import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import axios from "axios";
import { useEffect, useState } from "react";
import { Button, Card, Container, Image, ListGroup, Modal, Spinner } from "react-bootstrap";
import "../index.css";

const RevealGame = (props) => {
  const [gameName, setGameName] = useState("");
  const [gameLetter, setGameLetter] = useState("");
  const [gameIcon, setGameIcon] = useState("");
  const [revealName, setRevealName] = useState(false);
  const [dev, setDev] = useState([]);
  const [loading, setLoading] = useState(false);
  const {show, onHide, selectedGameId} = props;

  function handleHide(){
    setGameName("");
    setGameIcon("");
    setRevealName(false);
    setGameLetter("")
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
            setGameLetter(res.data.game_letter);
            setGameIcon(res.data.game_icon);
            setTimeout(() => {
              setRevealName(true);
            }, 1000);
          }
        })
        .catch((err) => {
          alert("There was an error occurred: " + err);
        });
      };

      Promise.all([getDevs(), selectGame()]).then(() => {
        setTimeout(() => {
          setLoading(false);
        }, 1000);
      });
    }
  }, [selectedGameId, show]);

  return ( 
    <>
      <Modal show={show} onHide={onHide} fullscreen={true}>
        <Modal.Header className="d-flex justify-content-center">
          <h2><b>{revealName ? gameName : gameLetter}</b></h2>
        </Modal.Header>
        <Modal.Body>
        <Button variant="outline-danger" onClick={() => handleHide()} style={{ width: "75px" }}><FontAwesomeIcon icon={faArrowLeft} /> </Button>
        {loading ? 
          (<>
            <Container className="text-center mt-5">
              <Spinner variant="success" animation="border" />
            </Container>
          </>):
          (<>
            <Container className="text-center mt-3" style={{ maxWidth: "600px" }}>
              <Image 
                src={process.env.PUBLIC_URL + "/images/gameIcon/" + gameIcon}
                alt={gameName + "'s Icon picture"}
                className="minimum-height border-1"
                fluid
              /> 
            </Container>
            <Card className="card-thin mt-3" border="dark">
              <Card.Footer><h4>Developers</h4></Card.Footer>
                <ListGroup variant="flush">
                  {dev.map((devs, index) =>(<ListGroup.Item key={index}>{devs.dev_name}</ListGroup.Item>))}
                </ListGroup>
            </Card>
				  </>)}
        </Modal.Body>
      </Modal>
    </>
  );
}
 
export default RevealGame;