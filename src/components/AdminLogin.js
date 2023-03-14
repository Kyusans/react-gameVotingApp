import axios from "axios";
import { useState } from "react";
import { Button, FloatingLabel, Form } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import AlertScript from "./AlertScript";

const AdminLogin = () => {
  const [adminId, setAdminId] = useState("");
  const [password, setPassword] = useState("");
  const navigateTo = useNavigate();
  //for alert
	const [showAlert, setShowAlert] = useState(false);
	const [alertVariant, setAlertVariant] = useState("");
	const [alertMessage, setAlertMessage] = useState("");

	function getAlert(variantAlert, messageAlert){
		setShowAlert(true);
		setAlertVariant(variantAlert);
		setAlertMessage(messageAlert);
	}

  const login = () =>{
    const url = localStorage.getItem("url") + "admin.php";
    const jsonData = {adminId: adminId, password: password}
    const formData = new FormData(); 
    formData.append("operation", "login");
    formData.append("json", JSON.stringify(jsonData));
    axios({url: url, data: formData, method: "post"})
    .then((res) => {
      if(res.data !== 0){
        localStorage.setItem("isAdminLoggined", "1");
        getAlert("success", "Welcome back admin!");
        setTimeout(() => {
          navigateTo("/admin/dashboard");
        }, 2000);
      }else{
        navigateTo("/");
      }
    })
    .catch((err) =>{
      getAlert("danger","There was an error occured: " + err);
    })
}
  return ( 
    <>
      <AlertScript show={showAlert} variant={alertVariant} message={alertMessage} />
      <Form className="text-center">
        <Form.Group>
          <FloatingLabel className="fatter-text mt-4 centered-label" label="Admin school Id">
            <Form.Control
              className="form-control"
              type="password"
              placeholder="school id"
              value={adminId}
              onChange={(e) => setAdminId(e.target.value)}
              required
            />
          </FloatingLabel>
        </Form.Group>

        <Form.Group>
          <FloatingLabel className="fatter-text mt-4 centered-label" label="Password">
            <Form.Control
              className="form-control"
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </FloatingLabel>
        </Form.Group>
        <Button className="button-large mt-3 btn-lg big-height btn-success" onClick={login}><div className="text-small">Login</div></Button>
    </Form>
    </>
  );
}
 
export default AdminLogin;