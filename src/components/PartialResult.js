import "../index.css";
import { useEffect, useState } from "react";
import { Container, Table, Spinner } from "react-bootstrap";
import axios from "axios";

const PartialResult = () => {
	const [gameResult, setGameResult] = useState([]);
	const [hasGameResult, setHasGameResult] = useState(false);
	const [reveal, setReveal] = useState(false);
 
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
						</tr>
					</thead>
					<tbody>
						{gameResult.map((items, index) => (
							<tr key={index}>
								<td>{index + 1}</td>
								<td>{reveal ? items.game_name : items.game_letter}</td>
								<td>{items.totalStars}</td>
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
		</>
	);
}
 
export default PartialResult;