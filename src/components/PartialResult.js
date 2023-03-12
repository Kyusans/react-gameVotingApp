import "../index.css";
import { useEffect, useState } from "react";
import { Container, Table, Spinner, Button } from "react-bootstrap";
import axios from "axios";
import RevealGame from "./RevealGame";

const PartialResult = () => {
	const [gameResult, setGameResult] = useState([]);
	const [hasGameResult, setHasGameResult] = useState(false);
	const [reveal, setReveal] = useState(false);
	const [gameId, setGameId] = useState("");

	const [showGameDetailModal, setShowGameDetailModal] = useState(false);

  const openGameDetailModal = (id) =>{
    setGameId(id)
    setShowGameDetailModal(true);
  }
  const closeGameDetailModal =  () =>{
    setGameId("")
    setShowGameDetailModal(false);
  }
 
	const getPartialResult = () =>{
		const url = localStorage.getItem("url") + "games.php";

		const formData = new FormData();
		formData.append("operation", "getGameResult");

		axios({url: url, data: formData, method:"post"})
		.then((res) =>{
			if(res.data !== 0){
				setGameResult(res.data);
				setHasGameResult(true);
			}else{
				setHasGameResult(false)
			}
		})
		.catch((err) =>{
			alert("There was an unexpected error : " + err);
		})
	}

	useEffect(() =>{
		if(localStorage.getItem("url") === null){
			localStorage.setItem("url", "http://localhost/itdays/api/");
		}
		const checkStatus = async () =>{
			const url = localStorage.getItem("url") + "games.php";
			const formData = new FormData();
			formData.append("operation", "getSettings");
			try {
				const res = await axios({url: url, data: formData, method: "post"});
				const settings = res.data;
				const status = settings.find((setting) => setting.set_key === "reveal");
				if(status && status.set_value === "1"){
					setReveal(true);
				}else{
					setReveal(false)
				}
				getPartialResult();
				}catch(err) {
					alert("There was an unexpected error occured: ", err)
				}
		}
		checkStatus();
		const intervalId = setInterval(checkStatus, 5000);
		return () => clearInterval(intervalId);
	}, [])

	return ( 
		<>
			<Container fluid>
				<h2 className="text-center mt-3">Partial Result</h2>
				{ hasGameResult ? (<>
					<Table responsive striped bordered className="white-background mt-1 text-center margin-auto border-secondary w-75">
					<thead>
						<tr>
							<th className="green-header">Rank</th>
							<th className="green-header">Game</th>
							<th className="green-header">Stars</th>
							<th className="green-header">Action</th>
						</tr>
					</thead>
					<tbody>
						{gameResult.map((items, index) => (
							<tr key={index}>
								<td>{index + 1}</td>
								<td>{reveal ? items.game_name : items.game_letter}</td>
								<td>{items.totalStars}</td>
								<td><Button variant="outline-success" onClick={() => openGameDetailModal(items.game_id)}>Reveal</Button></td>
							</tr>
						))}
					</tbody>
				</Table>
				</>) : (<>
					<Container className="text-center mt-4">
						<h5>Retrieving data <Spinner variant="success" size="sm" /></h5>
					</Container>
				</>)}
			</Container>
			<RevealGame show={showGameDetailModal} onHide={closeGameDetailModal} selectedGameId={gameId}/>
		</>
	);
}
 
export default PartialResult;