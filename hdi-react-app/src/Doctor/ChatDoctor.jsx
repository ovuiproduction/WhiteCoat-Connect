import react from "react";
import { useState, useEffect } from "react";
import "./Assests/css/ChatDoctor.css";
// hostDoctor
export default function ChatDoctor() {
  let [currentChater, setCurrentChater] = useState("");
  const [hostemail, setHostEmail] = useState("");
  const [dataDoctor, setDataDoctor] = useState([]);
  const [msg,setmsg] = useState("");
  let chatdata = "";
  const [chatsData , setChatsData] = useState([]);
  const fetchDoctors = async () => {
    try {
      let responseDoctor = await fetch("http://localhost:5000/findDoctor", {
        method: "post",
        body: JSON.stringify(),
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (responseDoctor.ok) {
        let data = await responseDoctor.json();
        setDataDoctor(data.data);
        setHostEmail(data.hostDoctor);
      } else {
        console.error("Error:", responseDoctor.statusText);
      }
    } catch (error) {
      console.error("An error occurred:", error);
    }
  };
  const fetchChats = async (semail) => {
    console.log(semail);
    try {
      let responseChats = await fetch("http://localhost:5000/fetchChats", {
        method: "post",
        body: JSON.stringify({sender:hostemail,receiver:semail}),
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (responseChats.ok) {
        let data = await responseChats.json();
        if(data.data != undefined ){
          chatdata = data.data.msgContainer;
          setChatsData(chatdata);
        }else{
          chatdata = "";
          setChatsData(chatdata);
        }
        console.log("chatdata",chatdata);
      } else {
        console.error("Error:", responseChats.statusText);
      }
    } catch (error) {
      console.error("An error occurred:", error);
    }
  };
  useEffect(() => {
    fetchDoctors();
  }, []);

  const sendMsg = async()=>{
    try {
      let result = await fetch("http://localhost:5000/sendmsg", {
        method: "post",
        body: JSON.stringify({msg:msg,receiver:currentChater,sender:hostemail}),
        headers: {
          "Content-Type": "application/json",
        },
      });
    } catch (error) {
      console.error("An error occurred:", error);
    }
    setmsg("");
    fetchChats(currentChater);
  }

  const setChat = async (selectemail) => {
    await startChat(selectemail);
    fetchChats(selectemail);
}

  const startChat = async (selectemail) => {
    setCurrentChater(selectemail);
  }

  return (
    <>
      <link
        href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css"
        rel="stylesheet"
        integrity="sha384-QWTKZyjpPEjISv5WaRU9OFeRpok6YctnYmDr5pNlyT2bRjXh0JMhjY6hW+ALEwIH"
        crossOrigin="anonymous"
      ></link>
      <nav className="chatDoctorNav">
        <a href="/homeDoctor">
          <h2>HDI</h2>
        </a>
      </nav>
      <div className="mainchatContainer">
        <div className="leftSideBar"></div>
        <div className="doctorListBlock">
          <ul>
            {dataDoctor
              .filter((doctor) => !doctor.email.startsWith(hostemail))
              .map((doctor) => (
                <li>
                  <div
                    onClick={() => setChat(doctor.email)}
                    className="doctors"
                  >
                    <img
                      src="https://cdn-icons-png.flaticon.com/512/194/194915.png"
                      alt=""
                    />
                    <p>{doctor.name}</p>
                  </div>
                </li>
              ))}
          </ul>
        </div>
        <div className="msgBlock">
          <div className="msgnav">{currentChater}</div>
              
              {/* chat block */}
          <div className="mainchat">
           {chatsData && chatsData.map((chats)=>(
            chats.sender === hostemail ? (
              <p className="senderclass" key={chats.id}>{chats.msg}</p>
          ) : <p className="receiverclass" key={chats.id}>{chats.msg}</p>
           ))}
          </div>

          <div className="sendmsgBlock">
            <input value={msg} onChange={(e)=>setmsg(e.target.value)} type="text" />
            <button onClick={sendMsg} type="button" class="btn btn-success">
              Send
            </button>
          </div>
        </div>
      </div>
      <script
        src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js"
        integrity="sha384-YvpcrYf0tY3lHB60NNkmXc5s9fDVZLESaAA55NDzOxhy9GkcIdslK1eN7N6jIeHz"
        crossOrigin="anonymous"
      ></script>
    </>
  );
}
