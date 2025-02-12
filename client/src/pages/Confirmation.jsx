import { useNavigate } from "react-router-dom";

function Confirmation(){

  const nav = useNavigate();

    return(
    <>
      <header>
      <div className="Logo">
          <img className="logoPicture" src="https://img.freepik.com/free-vector/chatbot-chat-message-vectorart_78370-4104.jpg?t=st=1739194345~exp=1739197945~hmac=c1020f36982eb3b68289d6519c9cfe6eef14dd88a25eadaf2b45cf453eea3d25&w=740"/>
      </div>
      <h1>CRM System</h1>
      <div className="sidebutton">
             <button className="loginBtn" onClick={() => nav("/login")}>Log in</button>
      </div>
      </header>

      <main>  
           <div className="loginArea">
               <div className="loginlogoPlacement">
                  <img className="loginLogo" src="https://img.freepik.com/free-vector/chatbot-chat-message-vectorart_78370-4104.jpg?t=st=1739194345~exp=1739197945~hmac=c1020f36982eb3b68289d6519c9cfe6eef14dd88a25eadaf2b45cf453eea3d25&w=740"/>
               </div>
               <h2>Thank you for reaching out!</h2>
               <h3>We have received your message and will get back to you as soon as possible.
               Best regards,</h3>
               <button className="sendBtn" onClick={() => nav("/")}>Go Back</button>
           </div>
      </main>

      <footer>
        <p>&copy; 2025 CRM System. All rights reserved.</p>
      </footer>
    </>
    )
}

export default Confirmation