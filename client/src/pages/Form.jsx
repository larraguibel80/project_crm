import { useState } from "react";
import { useNavigate } from "react-router-dom";

function Form(){

  const nav = useNavigate();

  const [form, setForm]  = useState({
    email: "",
    service_product: "",
    message: ""
  });

  const handleChange = (e) => {
    setForm({...form, [e.target.name]: e.target.value});
  };

  const handleSubmit = async () => {
    if(form.email === "" || form.service_product === "" || form.message === ""){
      console.error("You can not send a form empty");
      return
    }



    try{
      const response = await fetch("http://localhost:3000/api/forms", {
        method: "POST",
        headers:{
        "Content-Type": "application/json",
      },
      body: JSON.stringify(form)
    });

    if (response.ok) {
      console.log("Form sent!")
      nav("/confirmation")
    } else {
      console.error("Something went wrong!");
    }
  } catch(error) {
    console.error("Wrong connection with server", error)
  }};

  return(
    <>
    <header>
      <div className="logoPlacement">
          <img className="logoPicture" src="https://img.freepik.com/free-vector/chatbot-chat-message-vectorart_78370-4104.jpg?t=st=1739194345~exp=1739197945~hmac=c1020f36982eb3b68289d6519c9cfe6eef14dd88a25eadaf2b45cf453eea3d25&w=740"/>
      </div>
      <h1>CRM System</h1>
      <div className="sidebutton">
             <button className="loginBtn" onClick={() => nav("/login")}>Log in</button>
      </div>
    </header>

    <main>
       <div className="formArea">
         <h2>Contact Form</h2>
         <input type="email" name="email" placeholder="Email" value={form.email} onChange={handleChange}/>
         <input type="text" name="service_product" placeholder="Product" value={form.service_product} onChange={handleChange}></input>
         <textarea placeholder="Message" name="message" rows = "6" value={form.message} onChange={handleChange}></textarea>
         <button className="sendBtn" onClick={handleSubmit}>Send</button>
       </div>
    </main>

    <footer>
      <p> &copy; 2025 CRM System. All rights reserved.</p>
    </footer>
    </>
  )
}
export default Form