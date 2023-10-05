import "../index.css";
import { useEffect, useState } from "react";
import { Container, Table, Spinner, Button } from "react-bootstrap";
import { BiShow, BiHide } from 'react-icons/bi';
import axios from "axios";
import RevealGame from "./RevealGame";

const PartialResult = () => {
	if(localStorage.getItem("url") === null){
		// url naa sa imong steam comment nga notepad
		localStorage.setItem("url", "http://localhost/itdays/api/");
	}
	const [gameResult, setGameResult] = useState([]);
	const [hasGameResult, setHasGameResult] = useState(false);
	const [reveal, setReveal] = useState(false);
	const [gameId, setGameId] = useState("");
	const [showGameDetailModal, setShowGameDetailModal] = useState(false);

	const openGameDetailModal = (id, status) =>{
		setGameId(id)
		if(status === 1){
			setShowGameDetailModal(true);
		}
		setTimeout(() => {
			handleReveal(id, status);
		}, 3000);
	}
	  const closeGameDetailModal =  () =>{
		setGameId("")
		setShowGameDetailModal(false);
	  }
 
	const getPartialResult = async () =>{
		const url = localStorage.getItem("url") + "games.php";

		const formData = new FormData();
		formData.append("operation", "getGameResult");

		try{
			const res = await axios({url: url, data: formData, method: "post"})
			if(res.data !== 0){
				setGameResult(res.data);
				setHasGameResult(true);
			}else{
				setHasGameResult(false);
			}
		}catch(err){
			alert("There was an unexepcted error : " + err);
		}
	}
	const handleReveal = async (gameId, status) =>{
		const url = localStorage.getItem("url") + "admin.php";
		const jsonData = {gameId: gameId, status: status}
		const formData = new FormData();
		formData.append("operation", "revealGame");
		formData.append("json", JSON.stringify(jsonData));
		try{
			const res = await axios({url: url, data: formData, method: "post"})
			console.log("res ni HANDLE REVEAL: " + JSON.stringify(res.data))
			if(res.data !== 0){
				getPartialResult();
			}
		}catch(err){
			alert("There was an unexepcted error : " + err);
		}
	}
	useEffect(() =>{
    localStorage.setItem("isAdminLoggined", "0");
		const checkStatus = async () =>{
			const url = localStorage.getItem("url") + "settings.php";
			const formData = new FormData();
			formData.append("operation", "getRevealStatus");
			try {
				const res = await axios({url: url, data: formData, method: "post"});
				console.log("res ni checkstatus : " + JSON.stringify(res.data));
				if(res.data === "1"){
					setReveal(true);
				}else{
					setReveal(false)
				}
				getPartialResult();
				}catch(err) {
					alert("There was an unexpected error occured: " + err)
				}
		}
		checkStatus();
		const intervalId = setInterval(checkStatus, 20000);
		return () => clearInterval(intervalId);
	}, [])

	return ( 
		<>
			<Container>
				<h2 className="text-center mt-3">Partial Result</h2>
				{ hasGameResult ? (<>
					<Table responsive striped bordered className="white-background mt-1 text-center margin-auto border-secondary">
					<thead>
						<tr>
							<th className="green-header">Rank</th>
							<th className="green-header">Game</th>
							<th className="green-header">Stars</th>
							<th className="green-header">Reveal game</th>
						</tr>
					</thead>
					<tbody>
						{gameResult.map((items, index) => (
							<tr key={index}>
								<td>{index + 1}</td>
								<td><h4>{items.game_status === 1 && reveal ? items.game_name : items.game_letter}</h4></td>
								<td>{items.totalStars}</td>
								<td>
									{
										items.game_status === 0 && reveal ?<Button variant="outline-success" onClick={() => openGameDetailModal(items.game_id, 1)}><BiShow /></Button>:
										<Button variant="outline-secondary" onClick={() => openGameDetailModal(items.game_id, 0)}><BiHide /></Button>
									}
								</td>
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
