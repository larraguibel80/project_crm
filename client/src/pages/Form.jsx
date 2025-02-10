import { useNavigate } from "react-router-dom";

function Form(){

  const nav = useNavigate();

  return(
    <>
    <header>
      <div className="Logo">
          <img class="logoPicture" src="https://img.freepik.com/free-vector/chatbot-chat-message-vectorart_78370-4104.jpg?t=st=1739194345~exp=1739197945~hmac=c1020f36982eb3b68289d6519c9cfe6eef14dd88a25eadaf2b45cf453eea3d25&w=740"/>
      </div>
      <h1>CRM System</h1>
      <div class="sidebutton">
             <button class="loginBtn" onClick={() => nav("/login")}>Log in</button>
      </div>
    </header>

    <main>
       <div className="form">
         <h2>Contact Form</h2>
         <input type="text" placeholder="Email"/>
         <input type="text" placeholder="Product"></input>
         <textarea placeholder="Message" rows = "6"></textarea>
         <button className="send" onClick={() => nav("/confirmation")}>Send</button>
         
       </div>
    </main>

    <footer>
      <p>CRM System</p>
      <p>+46867849305</p>
      <p>Crm_G5@gmail.com</p>
    </footer>
    </>
  )
}
export default Form