import axios from "axios";
import { useEffect, useState } from "react";
import { Button, Container, Table } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import AdminSettings from "./AdminSettings";
import AlertScript from "./AlertScript";
import RevealGame from "./RevealGame";

const AdminDashboard = () => {
  const [gameResult, setGameResult] = useState([]);
	const [hasGameResult, setHasGameResult] = useState(false);
	const [reveal, setReveal] = useState(false);
	const [gameId, setGameId] = useState("");
	const [showGameDetailModal, setShowGameDetailModal] = useState(false);
  	//for alert
	const [showAlert, setShowAlert] = useState(false);
	const [alertVariant, setAlertVariant] = useState("");
	const [alertMessage, setAlertMessage] = useState("");
  const navigateTo = useNavigate();
  const [showAdminSettingsModal, setShowAdminSettingsModal] = useState(false);
  const openAdminSettingsModal = () =>{
    setShowAdminSettingsModal(true);
  }
  const closeAdminSettingsModal =  () =>{
    setShowAdminSettingsModal(false);
  }

	function getAlert(variantAlert, messageAlert){
		setShowAlert(true);
		setAlertVariant(variantAlert);
		setAlertMessage(messageAlert);
	}
  const openGameDetailModal = (id) =>{
    setGameId(id)
    setShowGameDetailModal(true);
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
  useEffect(() =>{
		if(localStorage.getItem("isAdminLoggined") === "1"){
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
    }else{
      getAlert("danger", "Wait you are not admin!");
      setTimeout(() => {
        navigateTo("/");
      }, 1500);
    }
	}, [navigateTo])
  return ( 
    <>
      <Container fluid>
        <Container className="text-end mt-3">     
          <Button variant="outline-primary" onClick={openAdminSettingsModal}>Settings</Button>
        </Container>
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
            <AlertScript show={showAlert} variant={alertVariant} message={alertMessage} />
					</Container>
				</>)}
			</Container>
			<RevealGame show={showGameDetailModal} onHide={closeGameDetailModal} selectedGameId={gameId}/>
      <AdminSettings show={showAdminSettingsModal} onHide={closeAdminSettingsModal}/>
    </>
  );
}
 
export default AdminDashboard;