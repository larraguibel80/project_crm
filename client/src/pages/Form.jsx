function Form(){
  return(
    <>
    <header>
      <h1>CRM System</h1>
    </header>
    
      <div className="form">
         <h2>Form</h2>
         <input type="text" placeholder="Email"/>
         <input type="text" placeholder="Product"></input>
         <textarea placeholder="Message" rows = "6"></textarea>
         <button className="send">Send</button>
         
      </div>
      </>
  )
}
export default Form