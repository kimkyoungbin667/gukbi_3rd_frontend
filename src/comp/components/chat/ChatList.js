import React, { useState, useEffect, useRef } from "react";
import { getChatRoomList, getChatRoomMsg } from "../../api/chat.js";
import "../../css/chat/chat.css";
import SockJS from "sockjs-client";
import { Client } from "@stomp/stompjs";
import { jwtDecode } from "jwt-decode";
import notificationIcon from '../../../assets/img/bbab.png';
import Notification from '../chat/ChatAlarm.js';

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
    const [imageSubscription, setImageSubscription] = useState(null);
    const [opponentProfileUrl, setOpponentProfileUrl] = useState('');
    const messagesEndRef = useRef(null);
    const [personName, setPersonName] = useState('');
    const [selectedImage, setSelectedImage] = useState('');
    const chunkSize = 10000;  // ✅ 청크 크기 (10KB)
    const [showNotification, setShowNotification] = useState(false); // 알림 표시 상태
    const [alarmMessage, setAlarmMessage] = useState('');
    const [notifications, setNotifications] = useState([]); // 알림 리스트 상태 추가


    const token = localStorage.getItem("token");
    const decodedToken = jwtDecode(token);
    const userIdx = decodedToken.sub;

    useEffect(() => {

        const socket = new SockJS(`http://58.74.46.219:33334/ws?token=${token}`);
        const client = new Client({
            webSocketFactory: () => socket,
            debug: (str) => console.log(str),
            reconnectDelay: 5000,  // ✅ 연결이 끊어지면 5초 후 재연결
            heartbeatIncoming: 4000,  // ✅ 서버 → 클라이언트 핑 (4초)
            heartbeatOutgoing: 4000,  // ✅ 클라이언트 → 서버 핑 (4초)
            onConnect: () => console.log("✅ WebSocket 연결 성공!"),
            onDisconnect: () => console.log("❌ WebSocket 연결 종료!"),
            beforeConnect: () => console.log("🔄 WebSocket 연결 준비 중..."),
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

    // 알람 리스트 설정
    const handleNewMessage = (receivedMessage) => {
        const now = new Date();
        const sendTime = formatTime2(now);

        // 알림 최대 5개 유지
        setNotifications((prevNotifications) => {
            if (prevNotifications.length >= 5) {
                prevNotifications.shift(); // 가장 오래된 알림을 삭제
            }
            return [...prevNotifications, { message: receivedMessage.message, time: sendTime }]; // 메시지와 시간을 함께 추가
        });

        // 3초 후 알림을 삭제
        setTimeout(() => {
            setNotifications((prevNotifications) =>
                prevNotifications.filter((_, index) => index !== 0) // 첫 번째 알림 삭제
            );
        }, 3000);
    };


    // 알림 시간 설정
    const formatTime2 = (date) => {
        const hours = String(date.getHours()).padStart(2, "0");
        const minutes = String(date.getMinutes()).padStart(2, "0");
        return `${hours}:${minutes}`;
    };

    const handleCloseNotification = (index) => {
        setNotifications((prevNotifications) =>
            prevNotifications.filter((_, i) => i !== index) // 선택된 알림 삭제
        );
    };

    const handleRoomClick = (roomIdx, index, opponentProfileUrl) => {
        if (!stompClient || !stompClient.connected) return;

        setSelectedRoomIdx(roomIdx);
        setPersonName(chatRoomList[index].opponentName);
        setOpponentProfileUrl(opponentProfileUrl);

        // ✅ 기존 구독 해제 (메시지, 타이핑, 이미지)
        if (currentSubscription) {
            currentSubscription.unsubscribe();
            setCurrentSubscription(null);
        }

        if (typingSubscription) {
            typingSubscription.unsubscribe();
            setTypingSubscription(null);
        }

        if (imageSubscription) {
            imageSubscription.unsubscribe();
            setImageSubscription(null);
        }


        // ✅ 메시지 구독을 먼저 설정
        const newMessageSubscription = stompClient.subscribe(`/topic/room/${roomIdx}`, (msg) => {
            const receivedMessage = JSON.parse(msg.body);
            console.log("📩 새 메시지 수신:", receivedMessage);

            handleNewMessage(receivedMessage);  // 알림 처리 함수 호출
            setChatRoomMsg((prev) => [...prev, receivedMessage]);
        });


        const newTypingSubscription = stompClient.subscribe(`/topic/room/${roomIdx}/typing`, (msg) => {
            const typingStatus = JSON.parse(msg.body);
            if (typingStatus.senderIdx != userIdx) {
                setIsTyping(typingStatus.typing);
            }
        });

        const newImageSubscription = stompClient.subscribe(`/topic/room/${roomIdx}/image`, (msg) => {
            const receivedImage = JSON.parse(msg.body);
            console.log("🖼️ 수신된 이미지:", receivedImage);

            // 이미지 데이터를 확인하고 chatRoomMsg에 추가
            if (receivedImage && receivedImage.image) {
                setChatRoomMsg((prev) => [...prev, receivedImage]);
            } else {
                console.error("이미지 데이터가 없습니다.");
            }
        });


        // ✅ 구독 상태 저장
        setCurrentSubscription(newMessageSubscription);
        setTypingSubscription(newTypingSubscription);
        setImageSubscription(newImageSubscription);

        // ✅ 기존 메시지 불러오기 (중복 데이터 방지)
        getChatRoomMsg({ roomIdx })
            .then((res) => {
                if (res.data.code === "200") {
                    console.log(res.data);
                    setChatRoomMsg(res.data.data);  // ✅ 메시지 초기화
                }
            })
            .catch((err) => console.error("Error fetching chat messages:", err));
    };

    // ✅ selectedImage가 변경될 때마다 sendImageInChunks 실행
    useEffect(() => {
        if (selectedImage) {
            sendImageInChunks(selectedImage);  // ✅ 선택된 이미지를 인자로 전달
        }
    }, [selectedImage]);

    const resizeImage = (file) => {
        return new Promise((resolve, reject) => {
            const img = new Image();
            const reader = new FileReader();

            reader.onload = (e) => {
                img.src = e.target.result;
            };

            img.onload = () => {
                const canvas = document.createElement('canvas');
                const ctx = canvas.getContext('2d');

                const maxSize = 500; // 최대 크기 설정 (픽셀)
                let width = img.width;
                let height = img.height;

                if (width > height && width > maxSize) {
                    height *= maxSize / width;
                    width = maxSize;
                } else if (height > maxSize) {
                    width *= maxSize / height;
                    height = maxSize;
                }

                canvas.width = width;
                canvas.height = height;
                ctx.drawImage(img, 0, 0, width, height);

                // 압축 비율을 100%로 설정
                resolve(canvas.toDataURL('image/jpeg', 1.0)); // 100% 품질
            };

            reader.onerror = (err) => reject("❌ Failed to read file:", err);
            reader.readAsDataURL(file);
        });
    };



    const sendImageInChunks = async (file) => {
        if (!stompClient || !stompClient.connected) {
            console.error("❌ WebSocket 연결이 되어있지 않습니다.");
            return;
        }

        if (!file || !selectedRoomIdx) {
            console.error("❗ 이미지 또는 방 번호를 확인하세요.");
            return;
        }

        try {
            // ✅ 이미지 리사이징 및 압축
            const resizedImage = await resizeImage(file);

            // ✅ Base64 인코딩 데이터에서 헤더 제거
            const base64Data = resizedImage.replace(/^data:image\/\w+;base64,/, '');
            console.log("📦 전송할 이미지 데이터 (Base64):", base64Data);  // 데이터 확인

            const totalChunks = Math.ceil(base64Data.length / chunkSize);
            console.log(`📦 총 ${totalChunks}개의 청크로 나누어 전송합니다.`);

            // ✅ 청크 전송
            for (let i = 0; i < totalChunks; i++) {
                const chunkData = base64Data.slice(i * chunkSize, (i + 1) * chunkSize);
                console.log(`📨 청크 ${i + 1}/${totalChunks} 전송 시작`);

                stompClient.publish({
                    destination: `/app/room/${selectedRoomIdx}/sendImageChunk`,
                    body: JSON.stringify({
                        senderIdx: userIdx,
                        chunk: chunkData,
                        chunkIndex: i,
                        totalChunks: totalChunks,
                        type: "IMAGE",
                        sentAt: Date.now(),
                        isLastChunk: i === totalChunks - 1,  // 마지막 청크 여부
                        roomIdx: selectedRoomIdx,
                    }),
                });

                console.log(`📨 청크 ${i + 1}/${totalChunks} 전송 완료`);
            }

            console.log("✅ 모든 청크 전송 완료");

        } catch (error) {
            console.error("❌ 이미지 청크 전송 실패:", error);
        }
    };



    const groupMessagesByDate = (messages) => {
        // ✅ sentAt 값을 Date로 변환 후 정렬
        const sortedMessages = [...messages].sort((a, b) => {
            const timeA = new Date(a.sentAt).getTime();
            const timeB = new Date(b.sentAt).getTime();
            return timeA - timeB;  // 오름차순 (과거 → 현재)
        });

        const grouped = {};
        sortedMessages.forEach((msg) => {
            const dateObj = new Date(msg.sentAt);
            const date = `${dateObj.getFullYear()}-${String(dateObj.getMonth() + 1).padStart(2, '0')}-${String(dateObj.getDate()).padStart(2, '0')}`;
            if (!grouped[date]) grouped[date] = [];
            grouped[date].push(msg);
        });

        return grouped;
    };



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
            messagesEndRef.current.scrollIntoView({ behavior: "smooth", block: "end" });
        }
    }, [chatRoomMsg, isTyping]);

    const groupedMessages = groupMessagesByDate(chatRoomMsg);

    const handleImageLoad = () => {
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior: "smooth", block: "end" });
        }
    };


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
                        <img src={`http://58.74.46.219:33334${room.opponentProfileUrl}`} alt="프로필" className="profile-image" />
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
                                        const isMine = userIdx == item.senderIdx;

                                        return (
                                            <div key={index} className={isMine ? "message-right" : "message-left"}>
                                                <div className="message-wrapper">
                                                    {/* ✅ 내 메시지: 시간 → 말풍선 */}
                                                    {isMine && (
                                                        <>
                                                            <p className="message-time-left">{formatTime(item.sentAt)}</p>
                                                            {item.type === "IMAGE" || item.message == null ? (
                                                                <img src={`http://58.74.46.219:33334${item.image}`} alt="이미지 메시지" className="chat-image" onLoad={handleImageLoad} />
                                                            ) : (
                                                                <div className="message-content">{item.message}</div>
                                                            )}
                                                        </>
                                                    )}


                                                    {/* ✅ 상대 메시지: 말풍선 → 시간 */}
                                                    {!isMine && (
                                                        <>
                                                            {!isMine && (

                                                                <img src={`http://58.74.46.219:33334${item.senderProfile}`} alt="프로필" className="profile-image" />
                                                            )}
                                                            {item.type === "IMAGE" || item.message == null ? (
                                                                <img src={`http://58.74.46.219:33334${item.image}`} alt="이미지 메시지" className="chat-image" onLoad={handleImageLoad} />

                                                            ) : (
                                                                <div className="message-content">{item.message}</div>
                                                            )}
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


                        {/* 알림 표시 */}
                        <div className="notification-container">
                            {notifications.map((notification, index) => (
                                <Notification
                                    key={index}
                                    message={notification.message}
                                    time={notification.time}  // 시간 전달
                                    onClose={() => handleCloseNotification(index)}  // 알림 닫기
                                />
                            ))}
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

                            <div className="file-upload-container">
                                <label htmlFor="file-upload" className="custom-file-upload">
                                    이미지 전송 🖼️
                                </label>

                                <input
                                    id="file-upload"
                                    type="file"
                                    accept="image/*"
                                    onChange={(e) => {
                                        const file = e.target.files[0];
                                        if (file) {
                                            console.log("📁 선택한 파일:", file);
                                            sendImageInChunks(file);  // ✅ 청크 전송 함수 호출
                                        } else {
                                            console.error("❌ 파일이 선택되지 않았습니다.");
                                        }
                                    }}
                                />



                            </div>



                        </div>
                    </>
                ) : (
                    <h2>채팅방을 선택하세요</h2>
                )}
            </div>
        </div>
    );
}
