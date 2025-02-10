function Form(){

    return(
        <div className="form">
           <h2>Form</h2>
           
           <input type="text" placeholder="Email"/>
           <input type="text" placeholder="Product"></input>
           <textarea placeholder="Message" rows = "10"></textarea>
           <button className="send">Send</button>
        </div>
    )
}

export default Form