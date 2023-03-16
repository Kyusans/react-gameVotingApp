import axios from "axios";
import { useEffect, useState } from "react";
import { Card, CardGroup, Col, Container, Row } from "react-bootstrap";
import GameDetail from "./GameDetail";

const Games = () => {
  const [gameId, setGameId] = useState("");
  // Modal
  const [showGameDetailModal, setShowGameDetailModal] = useState(false);

  const openGameDetailModal = (id) =>{
    setGameId(id)
    setShowGameDetailModal(true);
  }
  const closeGameDetailModal =  () =>{
    setGameId("")
    setShowGameDetailModal(false);
    getGames();
  }
  const [game, setGame] = useState([]);

  const getGames = async () => {
    const url = localStorage.getItem("url") + "games.php";
    const formData = new FormData();
    formData.append("operation", "getGames");
    try{
      const res = await axios({url: url, data: formData,method: "post"})
      if (res.data !== 0) {
        setGame(res.data);
      }
    }catch(err){
      alert("Card View getGames There was an unexpected error occurred: " + err);
    }
  };

  useEffect(() => {
    getGames();
  }, []);
  return ( 
    <>
      <Container className="text-center">
        <h3 className="mt-3">Games</h3>
            <Row>
              {Array.isArray(game) &&
                game.map((games, index) => (
                  <Col key={index} md={3} xs={6}>
                    <CardGroup className="justify-content-center">
                      <Card onClick={() => openGameDetailModal(games.game_id)} className="mb-5 d-flex flex-column" style={{ border: '2px solid black' }}>
                        <Card.Img
                          className="mx-auto icon-image"
                          variant="top"
                          src={
                            process.env.PUBLIC_URL +
                            "/images/gameIcon/" +
                            games.game_icon
                          } />
                      </Card>
                    </CardGroup>
                  </Col>
                ))}
            </Row>
      </Container>
      <GameDetail show={showGameDetailModal} onHide={closeGameDetailModal} selectedGameId={gameId}/>
    </>
  );
}
 
export default Games;