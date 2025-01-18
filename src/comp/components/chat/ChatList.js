import React, { useState, useEffect, useRef } from "react";
import { getChatRoomList, getChatRoomMsg } from "../../api/chat.js";
import "../../css/chat/chat.css";
import SockJS from "sockjs-client";
import { Client } from "@stomp/stompjs";
import { jwtDecode } from "jwt-decode";

export default function Chat() {
    const [isTyping, setIsTyping] = useState(false);  // 상대방 입력 중 상태
    const [typingTimeout, setTypingTimeout] = useState(null);  // 입력 중 상태 시간 제한
    const [typingSubscription, setTypingSubscription] = useState(null);
    const [selectedRoomIdx, setSelectedRoomIdx] = useState(null);
    const [chatRoomList, setChatRoomList] = useState([]);
    const [chatRoomMsg, setChatRoomMsg] = useState([]);
    const [stompClient, setStompClient] = useState(null);
    const [message, setMessage] = useState("");
    const [currentSubscription, setCurrentSubscription] = useState(null);
    const [opponentProfileUrl, setOpponentProfileUrl] = useState('');
    const messagesEndRef = useRef(null);
    const [personName, setPersonName] = useState('');

    const token = localStorage.getItem("token");
    const decodedToken = jwtDecode(token);
    const userIdx = decodedToken.sub;

    useEffect(() => {
        const socket = new SockJS(`http://58.74.46.219:33334/ws?token=${token}`);
        const client = new Client({
            webSocketFactory: () => socket,
            debug: (str) => console.log(str),
            onConnect: () => console.log("WebSocket 연결 성공!"),
            onDisconnect: () => console.log("WebSocket 연결 종료!"),
            beforeConnect: () => console.log("WebSocket 연결 준비 중..."),
            connectHeaders: { Authorization: `Bearer ${token}` }
        });

        client.activate();
        setStompClient(client);

        getChatRoomList({ token })
            .then((res) => {
                if (res.data.code === "200") setChatRoomList(res.data.data);
            })
            .catch((err) => console.error("Error fetching chat room list:", err));

        return () => client.deactivate();
    }, []);

    const handleTyping = () => {
        if (stompClient && stompClient.connected) {
            stompClient.publish({
                destination: `/app/room/${selectedRoomIdx}/typing`,
                body: JSON.stringify({
                    senderIdx: userIdx,  // ✅ 보낸 사람 ID 추가
                    senderToken: token,
                    roomIdx: selectedRoomIdx,
                    typing: true,
                }),
            });
        }

        if (typingTimeout) clearTimeout(typingTimeout);
        setTypingTimeout(setTimeout(() => stopTyping(), 2000));
    };

    const stopTyping = () => {
        if (stompClient && stompClient.connected) {
            stompClient.publish({
                destination: `/app/room/${selectedRoomIdx}/typing`,
                body: JSON.stringify({
                    senderToken: token,
                    roomIdx: selectedRoomIdx,
                    typing: false,
                }),
            });
        }
    };



    const handleRoomClick = (roomIdx, index, opponentProfileUrl) => {
        if (!stompClient || !stompClient.connected) return;

        setSelectedRoomIdx(roomIdx);
        setPersonName(chatRoomList[index].opponentName);
        setOpponentProfileUrl(opponentProfileUrl);

        // 기존 메시지 구독 해제
        if (currentSubscription) currentSubscription.unsubscribe();

        // 기존 타이핑 상태 구독 해제
        if (typingSubscription) typingSubscription.unsubscribe();

        // 기존 메시지 불러오기
        getChatRoomMsg({ roomIdx })
            .then((res) => {
                if (res.data.code === "200") {
                    console.log(res.data);
                    setChatRoomMsg(res.data.data);
                }
            })
            .catch((err) => console.error("Error fetching chat messages:", err));

        // ✅ 메시지 구독
        const newMessageSubscription = stompClient.subscribe(`/topic/room/${roomIdx}`, (msg) => {
            const receivedMessage = JSON.parse(msg.body);
            setChatRoomMsg((prev) => [...prev, receivedMessage]);
        });

        // ✅ 타이핑 상태 구독
        const newTypingSubscription = stompClient.subscribe(`/topic/room/${roomIdx}/typing`, (msg) => {
            const typingStatus = JSON.parse(msg.body);

            // ✅ 본인이 아니면 isTyping 활성화
            if (typingStatus.senderIdx != userIdx) {
                setIsTyping(typingStatus.typing);
            }
        });

        // ✅ 구독 상태 저장
        setCurrentSubscription(newMessageSubscription);
        setTypingSubscription(newTypingSubscription);
    };



    // ✅ 날짜별 그룹화
    const groupMessagesByDate = (messages) => {
        const grouped = {};
        messages.forEach((msg) => {
            const dateObj = new Date(msg.sentAt);
            const date = `${dateObj.getFullYear()}-${String(dateObj.getMonth() + 1).padStart(2, '0')}-${String(dateObj.getDate()).padStart(2, '0')}`;
            if (!grouped[date]) grouped[date] = [];
            grouped[date].push(msg);
        });
        return grouped;
    };


    // ✅ 시간만 추출하는 함수 (HH:mm)
    const formatTime = (timestamp) => {
        const date = new Date(timestamp);
        const hours = String(date.getHours()).padStart(2, "0");
        const minutes = String(date.getMinutes()).padStart(2, "0");
        return `${hours}:${minutes}`;
    };


    // 메시지 전송
    const sendMessage = () => {
        if (stompClient && message.trim() !== "") {
            const now = new Date();
            const koreaTime = new Date(now.getTime() + 9 * 60 * 60 * 1000);  // KST로 변환

            stompClient.publish({
                destination: `/app/room/${selectedRoomIdx}/send`,
                body: JSON.stringify({
                    senderToken: token,
                    roomIdx: selectedRoomIdx,
                    message: message,
                    sentAt: koreaTime.toISOString(),
                }),
            });
            setMessage("");
            stopTyping();
        }
    };


    useEffect(() => {
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
        }
    }, [chatRoomMsg]);

    const groupedMessages = groupMessagesByDate(chatRoomMsg);

    return (
        <div className="chat-container">
            <div className="chat-list">
                <h2>📫 채팅방 리스트</h2>
                {chatRoomList.map((room, index) => (
                    <div
                        key={index}
                        className={`chat-list-item ${selectedRoomIdx === room.roomIdx ? "active" : ""}`}
                        onClick={() => handleRoomClick(room.roomIdx, index, room.opponentProfileUrl)}
                    >
                        <img src={room.opponentProfileUrl} alt="프로필" className="profile-image" />
                        <div className="opponent-name">{room.opponentName} 님과의 대화</div>
                    </div>
                ))}
            </div>

            <div className="chat-room">
                {selectedRoomIdx ? (
                    <>
                        <div className="chat-room-header">
                            <span className="chat-room-title">{personName}</span>
                        </div>

                        <div className="chat-room-messages">
                            {Object.keys(groupedMessages).map((date) => (
                                <div key={date}>
                                    <div className="date-divider">{date}</div>
                                    {groupedMessages[date].map((item, index) => {
                                        const isMine = userIdx == item.senderIdx;  // 내 메시지인지 확인

                                        return (
                                            <div key={index} className={isMine ? "message-right" : "message-left"}>
                                                <div className="message-wrapper">
                                                    {isMine ? (
                                                        <>
                                                            {/* ✅ 내 메시지 */}
                                                            <p className="message-time-left">{formatTime(item.sentAt)}</p>
                                                            <div className="message-content">{item.message}</div>
                                                        </>
                                                    ) : (
                                                        <>
                                                            {/* ✅ 상대 메시지 */}
                                                            <img src={item.senderProfile} alt="프로필" className="profile-image" />
                                                            <div className="message-content">{item.message}</div>
                                                            <p className="message-time-right">{formatTime(item.sentAt)}</p>
                                                        </>
                                                    )}
                                                </div>
                                            </div>
                                        );
                                    })}

                                </div>
                            ))}

                            {/* ✅ 상대방 입력 중일 때 점 애니메이션 */}
                            {isTyping && (
                                <div className="message-left">
                                    <img src={opponentProfileUrl} alt="프로필" className="profile-image" />
                                    <div className="message-content typing-indicator">
                                        <span></span>
                                        <span></span>
                                        <span></span>
                                    </div>
                                </div>
                            )}

                            <div ref={messagesEndRef} />
                        </div>


                        <div className="chat-room-input">

                            <textarea
                                value={message}
                                placeholder="메시지 입력 (Shift + Enter는 줄바꿈)"
                                onChange={(e) => {
                                    setMessage(e.target.value);
                                    handleTyping();  // ✅ 입력 중 상태 전송
                                }}
                                onKeyDown={(e) => {
                                    handleTyping();  // ✅ 입력 중 상태 전송
                                    if (e.key === "Enter" && !e.shiftKey) {
                                        e.preventDefault();  // ✅ 줄바꿈 방지
                                        sendMessage();       // ✅ Enter로 전송
                                    }
                                }}
                                rows="1"  // ✅ 처음에는 한 줄
                                style={{
                                    width: "100%",
                                    maxHeight: "100px",     // ✅ 최대 높이 설정
                                    padding: "10px",
                                    border: "1px solid #ddd",
                                    borderRadius: "8px",

                                }}
                            />
                            <button onClick={sendMessage}>전송</button>
                        </div>
                    </>
                ) : (
                    <h2>채팅방을 선택하세요</h2>
                )}
            </div>
        </div>
    );
}
