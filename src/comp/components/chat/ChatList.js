import React, { useState, useEffect, useRef } from "react";
import { getChatRoomList, getChatRoomMsg } from "../../api/chat.js";
import "../../css/chat/chat.css";
import SockJS from "sockjs-client";
import { Client } from "@stomp/stompjs";
import { GiNewBorn } from "react-icons/gi";
import { jwtDecode } from "jwt-decode";

export default function Chat() {
    const [selectedRoomIdx, setSelectedRoomIdx] = useState(null); // 선택된 채팅방 ID
    const [chatRoomList, setChatRoomList] = useState([]); // 채팅방 리스트
    const [chatRoomMsg, setChatRoomMsg] = useState([]); // 채팅 메시지 목록
    const [stompClient, setStompClient] = useState(null); // STOMP 클라이언트
    const [message, setMessage] = useState(""); // 입력 메시지
    const [currentSubscription, setCurrentSubscription] = useState(null); // 현재 구독
    const messagesEndRef = useRef(null); // 메시지 영역 끝 참조
    const [personName, setPersonName] = useState(''); // 클릭한 채팅에 있는 사람 이름

    // 토큰에서 userIdx 추출
    const token = localStorage.getItem("token");
    const decodedToken = jwtDecode(token);
    const userIdx = decodedToken.sub;


    // WebSocket 연결
    useEffect(() => {
        // 로컬 스토리지에서 토큰 가져오기

        console.log("토큰 : ", token);
        // SockJS에 URL에 토큰 추가 (옵션 1)
        const socket = new SockJS(`http://58.74.46.219:33334/ws?token=${token}`);
        const client = new Client({
            webSocketFactory: () => socket,
            debug: (str) => console.log(str),
            onConnect: () => {
                console.log("WebSocket 연결 성공!");
            },
            onDisconnect: () => {
                console.log("WebSocket 연결 종료!");
            },
            beforeConnect: () => {
                console.log("WebSocket 연결 준비 중...");
            },
            connectHeaders: {
                Authorization: `Bearer ${token}`, // 헤더에 토큰 포함
            },
        });

        client.activate();
        setStompClient(client);

        // 채팅방 목록 가져오기
        let obj = {};
        obj.token = token;

        getChatRoomList(obj)
            .then((res) => {
                console.log(res);
                console.log(res.data.data);
                if (res.data.code === "200") {
                    setChatRoomList(res.data.data);
                }
            })
            .catch((err) => console.error("Error fetching chat room list:", err));

        return () => {
            if (client) client.deactivate(); // 컴포넌트 언마운트 시 연결 해제
        };
    }, []);



    // 채팅방 클릭 핸들러
    const handleRoomClick = (roomIdx, index) => {
        if (!stompClient || !stompClient.connected) {
            console.error("STOMP 연결이 되어 있지 않습니다.");
            return;  // 연결이 없으면 구독 중단
        }

        setSelectedRoomIdx(roomIdx);
        setPersonName(chatRoomList[index].opponentName);

        let obj = { roomIdx: roomIdx };
        getChatRoomMsg(obj)
            .then((res) => {
                if (res.data.code === "200") {
                    console.log(res);
                    setChatRoomMsg(res.data.data);
                }
            })
            .catch((err) => console.error("Error fetching chat messages:", err));

        if (currentSubscription) {
            currentSubscription.unsubscribe();
        }

        const newSubscription = stompClient.subscribe(`/topic/room/${roomIdx}`, (msg) => {
            const receivedMessage = JSON.parse(msg.body);
            setChatRoomMsg((prev) => [...prev, receivedMessage]);
        });

        setCurrentSubscription(newSubscription);
    };


    // 메시지 전송
    const sendMessage = () => {
        if (stompClient && message.trim() !== "") {
            stompClient.publish({
                destination: `/app/room/${selectedRoomIdx}/send`,
                body: JSON.stringify({
                    senderToken: token,
                    roomIdx: selectedRoomIdx,
                    message: message,
                    sentAt: new Date().toISOString(), // 현재 시간 추가
                }),
            });
            setMessage(""); // 입력 필드 초기화
        }
    };

    // 메시지 업데이트 시 스크롤 이동
    useEffect(() => {
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
        }
    }, [chatRoomMsg]);

    return (
        <div className="chat-container">

            {/* 채팅 리스트 */}
            <div className="chat-list">
                <h2>채팅방 리스트</h2>
                {chatRoomList.map((room, index) => (
                    <div
                        key={index}
                        className={`chat-list-item ${selectedRoomIdx === room.roomIdx ? "active" : ""}`}
                        onClick={() => handleRoomClick(room.roomIdx, index)}
                    >
                        <div className="chat-room-profile">
                            <img
                                src={room.opponentProfileUrl}
                                alt={`${room.opponentName}의 프로필`}
                                className="profile-image"
                                style={{ width: "50px", height: "50px", borderRadius: "50%" }}
                            />
                        </div>
                        <div className="chat-list-details">
                            <span className="chat-list-title">{room.opponentName} 님과의 대화</span>
                        </div>
                    </div>
                ))}
            </div>

            {/* 선택된 채팅방 */}
            <div className="chat-room">
                {selectedRoomIdx ? (
                    <>
                        <div className="chat-room-header">
                            <div className="chat-room-info">
                                <span className="chat-room-title">{personName}</span>
                            </div>
                        </div>
                        <div className="chat-room-messages">
                            {chatRoomMsg.map((item, index) => {

                                const isMine = userIdx == item.senderIdx;

                                return (
                                    <div
                                        key={index}
                                        className={isMine ? "message-right" : "message-left"} // 조건부 클래스 적용
                                    >
                                        <div className="message-content">
                                            <p>
                                                <strong>{item.sender}</strong>
                                            </p>
                                            <p>{item.message}</p>
                                            <p className="message-time">{item.sentAt.slice(-8)}</p>
                                        </div>
                                    </div>
                                );
                            })}
                            <div ref={messagesEndRef} /> {/* 메시지 영역 끝에 참조 추가 */}
                        </div>

                        <div className="chat-room-input">
                            <input
                                type="text"
                                value={message}
                                placeholder="메시지를 입력하세요"
                                onChange={(e) => setMessage(e.target.value)}
                                onKeyDown={(e) => {
                                    if (e.key === "Enter") {
                                        sendMessage(); // 엔터 키로 메시지 전송
                                        e.preventDefault(); // 기본 엔터 동작(줄바꿈) 방지
                                    }
                                }}
                            />
                            <button className="send-button" onClick={sendMessage}>
                                전송
                            </button>
                        </div>

                    </>
                ) : (
                    <h2>채팅방을 선택하세요</h2>
                )}
            </div>
        </div>
    );
}
