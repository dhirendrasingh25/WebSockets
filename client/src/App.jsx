import React ,{useEffect ,useMemo,useState} from 'react'
import { io } from "socket.io-client";
const server = import.meta.env.VITE_BACKEND_URL;
// io means entire circuit
const App = () => {
  // const socket = io("http://localhost:6969");
  // console.log(server);
  const socket = useMemo(() => io(server,{
    withCredentials:true
  
  }), []);
  const [messages, setMessages] = useState([])
  const [message, setMessage] = useState("")
  const [room, setRoom] = useState("")
  const [socketId, setsocketId] = useState("")
  const [roomName, setRoomName] = useState("")

  useEffect(() => {
    socket.on("connect",()=>{
      console.log("Connected" ,socket.id);
      setsocketId(socket.id)
    })
    socket.on("recieve-message",(data)=>{
      console.log(data);
      setMessages((messages)=>[...messages,data])
    })
    return ()=>{
      socket.disconnect()
    }
  }, [])
  
  const handlesubmit = (e) => {
    e.preventDefault();
    // console.log(message);
    socket.emit("message", {message,room});
    setMessage("");

  }
  const handleRoomNamesubmit = (e) => {
    e.preventDefault();
    console.log(roomName);
    socket.emit("join-room", {roomName});
    setRoomName("");

  }
  return (
    <div className='w-full h-full'>
      <h1 className="text-3xl text-blue-600 p-4 font-bold text-center">
       Socket.Io Client
      </h1>
      <form className='p-4 flex flex-col space-y-4 justify-center' onSubmit={handleRoomNamesubmit}>
      <input className='border w-full outline-none rounded-lg p-3 ' value={roomName} onChange={(e)=>setRoomName(e.target.value)} type="text" placeholder="Enter Room Name" />
      <button className='border w-full py-2 rounded-lg  bg-blue-600 hover:bg-blue-400 font-semibold text-white ' type="submit">Join</button>
      </form>
      <h2 className='text-xl p-4 text-center'>Socket Id : {socketId}</h2>
      <form className='p-4 flex flex-col space-y-4 justify-center' onSubmit={handlesubmit}>
        <input className='border w-full outline-none rounded-lg p-3 ' value={room} onChange={(e)=>setRoom(e.target.value)} type="text" placeholder="Enter Room ID" />
        <input className='border w-full  outline-none rounded-lg p-3 ' value={message} onChange={(e)=>setMessage(e.target.value)} type="text" placeholder="Enter Message" />
        <button className='border w-full py-2 rounded-lg  bg-blue-600 hover:bg-blue-400 font-semibold text-white ' type="submit">Send</button>
      </form>
      <div className='text-base p-4 font-bold'>
          Messages
      </div>
      <div className='p-4'>
        {messages.map((msg,i)=>(
          <div key={i} className='p-2 border m-2'>
            {msg}
          </div>
        ))}
      </div>
    </div>
  )
}

export default App
