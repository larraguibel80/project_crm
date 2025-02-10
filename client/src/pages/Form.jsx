function Form(){
  return(
    <>
    <header>
      <div className="Logo">
          <img class="logoPicture" src="https://img.freepik.com/free-vector/chatbot-chat-message-vectorart_78370-4104.jpg?t=st=1739194345~exp=1739197945~hmac=c1020f36982eb3b68289d6519c9cfe6eef14dd88a25eadaf2b45cf453eea3d25&w=740"/>
          <h1>CRM System</h1>
      </div>
      <div class="sidebutton">
             <button class="loginBtn">Login</button>
      </div>
    </header>
    
      <div className="form">
         <h2>Contact Form</h2>
         <input type="text" placeholder="Email"/>
         <input type="text" placeholder="Product"></input>
         <textarea placeholder="Message" rows = "6"></textarea>
         <button className="send">Send</button>
         
      </div>
      </>
  )
}
export default Form