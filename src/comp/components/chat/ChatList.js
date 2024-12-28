import React, { useState, useEffect, useRef } from "react";
import { getChatRoomList, getChatRoomMsg } from "../../api/chat.js";
import "../../css/chat/chat.css";
import SockJS from "sockjs-client";
import { Client } from "@stomp/stompjs";
import { GiNewBorn } from "react-icons/gi";

export default function Chat() {
    const [selectedRoomIdx, setSelectedRoomIdx] = useState(null); // 선택된 채팅방 ID
    const [chatRoomList, setChatRoomList] = useState([]); // 채팅방 리스트
    const [chatRoomMsg, setChatRoomMsg] = useState([]); // 채팅 메시지 목록
    const [stompClient, setStompClient] = useState(null); // STOMP 클라이언트
    const [message, setMessage] = useState(""); // 입력 메시지
    const [currentSubscription, setCurrentSubscription] = useState(null); // 현재 구독
    const messagesEndRef = useRef(null); // 메시지 영역 끝 참조

    // userIdx 임시 설정
    const [userIdx, setUserIdx] = useState('5');
    const [personName, setPersonName] = useState(''); // 클릭한 채팅에 있는 사람 이름

    // WebSocket 연결
    useEffect(() => {

        const socket = new SockJS("http://localhost:8080/ws");
        const client = new Client({
            webSocketFactory: () => socket,
            debug: (str) => console.log(str),
            onConnect: () => {
                console.log("WebSocket 연결 성공!");
            },
            onDisconnect: () => {
                console.log("WebSocket 연결 종료!");
            },
        });

        client.activate();
        setStompClient(client);

        // 채팅방 목록 가져오기
        let obj = new Object();
        obj.userIdx = userIdx;

        getChatRoomList(obj)
            .then((res) => {
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

        // roomIdx : 채팅방 인덱스
        // index : 리스트 중 누른 인덱스
        setSelectedRoomIdx(roomIdx); // 선택된 채팅방 ID 업데이트

        // 채팅 상세에서 뜰 이름 설정
        setPersonName(chatRoomList[index].opponentName);

        // 채팅 내역 가져오기
        let obj = new Object();
        obj.roomIdx = roomIdx;

        getChatRoomMsg(obj)
            .then((res) => {
                if (res.data.code === "200") {
                    setChatRoomMsg(res.data.data);
                }
            })
            .catch((err) => console.error("Error fetching chat messages:", err));

        // 이전 구독 해제
        if (currentSubscription) {
            currentSubscription.unsubscribe();
        }

        // 새 채팅방 구독
        const newSubscription = stompClient.subscribe(`/topic/room/${roomIdx}`, (msg) => {
            const receivedMessage = JSON.parse(msg.body);

            // 상태 업데이트
            setChatRoomMsg((prev) => {
                const updatedMessages = [...prev, receivedMessage];
                return updatedMessages;
            });
        });

        setCurrentSubscription(newSubscription); // 새 구독 설정
    };

    // 메시지 전송
    const sendMessage = () => {
        if (stompClient && message.trim() !== "") {
            stompClient.publish({
                destination: `/app/room/${selectedRoomIdx}/send`,
                body: JSON.stringify({
                    senderIdx: userIdx,
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

                                const isMine = userIdx === item.senderIdx.toString();
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
