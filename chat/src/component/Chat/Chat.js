import React, { useEffect, useState } from 'react'
import { user } from "../Join/Join";
import socketIo from "socket.io-client";
import "./Chat.css";
import sendLogo from "../../images/send.png";
import Message from "../Message/Message";
import ReactScrollToBottom from "react-scroll-to-bottom";
import closeIcon from "../../images/closeIcon.png";
import { toast } from 'react-toastify';


let socket;

const ENDPOINT = "https://reactchatapp-backend.vercel.app";

const Chat = () => {

    const [id, setid] = useState("");
    const [allmessages, setAllMessages] = useState([])
    const [message, setMessage] = useState("")
    const [welcomeMsg, setWelcomeMsg] = useState("")
    const [userRltd, setuserRltd] = useState("")


    const sendMessage = () => {
        socket.emit('message', { message, id });
        setMessage("");
    }

    console.log(userRltd);

    useEffect(() => {
        if (userRltd) {
            toast(userRltd, {
                position: "top-center",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "dark",
            });
        }
        if (welcomeMsg) {
            toast(welcomeMsg, {
                position: "top-center",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "dark",
            });
            setWelcomeMsg("")
        }
    }, [userRltd, welcomeMsg])


    useEffect(() => {
        socket = socketIo(ENDPOINT, { transports: ['websocket'] });

        socket.on('connect', () => {
            setid(socket.id);
        });

        socket.emit('joined', { user })  // emit means send data & on means receive //

        socket.on('welcome', (data) => {
            setWelcomeMsg(data.message)
        });

        socket.on('userJoined', (data) => {
            setuserRltd(data.message);
        });

        socket.on('leave', (data) => {
            setuserRltd(data.message);
        });

    }, [])

    useEffect(() => {
        socket.on('sendMessage', (data) => {
            setAllMessages([...allmessages, data]);
        })
        
    }, [allmessages])

    return (
        <div className="chatPage">
            <div className="chatContainer">
                <div className="header">
                    <h2>C CHAT</h2>
                    <a href="/"> <img src={closeIcon} alt="Close" /></a>
                </div>
                <ReactScrollToBottom className="chatBox">
                    {
                        allmessages.map((item, i) =>
                            <Message
                                key={i}
                                user={item.id === id ? '' : item.user}
                                message={item.message}
                                classs={item.id === id ? 'right' : 'left'}
                            />
                        )
                    }
                </ReactScrollToBottom>
                <div className="inputBox">
                    <input onKeyPress={(event) => event.key === 'Enter' ? sendMessage() : null} type="text" id="chatInput" value={message}
                        onChange={(e) => setMessage(e.target.value)} />
                    <button onClick={sendMessage} className="sendBtn"><img src={sendLogo} alt="Send" /></button>
                </div>
            </div>

        </div>
    )
}

export default Chat
