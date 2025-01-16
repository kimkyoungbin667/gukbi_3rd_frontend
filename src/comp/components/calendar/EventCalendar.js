import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import "../../css/calendar/EventCalendar.css";
import { getMyPets } from "../../api/pet";
import { saveEvent, getEvents, updateEvent, deleteEvent, handleKakaoCallback  } from "../../api/calendar";
import { getUserProfile } from "../../api/user";
import axios from "axios";

const EventCalendar = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditPanelOpen, setIsEditPanelOpen] = useState(false);
  const [pets, setPets] = useState([]);
  const [userId, setUserId] = useState(null);
  const [events, setEvents] = useState([]);
  const [isKakaoUser, setIsKakaoUser] = useState(false); // 기본값은 일반 사용자로 설정
  const [newEvent, setNewEvent] = useState({
    petId: "",
    title: "",
    description: "",
    date: new Date(),
    time: "12:00",
  });
  const [selectedEvent, setSelectedEvent] = useState(null);

  const [searchParams] = useSearchParams(); // URL에서 인증 코드 추출

  useEffect(() => {
    const token = localStorage.getItem("token");
    console.log("사용 중인 액세스 토큰:", token);

    // 인증 코드 처리
    const authorizationCode = searchParams.get("code");
    if (authorizationCode) {
      handleKakaoConsent(authorizationCode);
    }

    const fetchPets = async () => {
      try {
        const petsData = await getMyPets();
        console.log("펫 데이터:", petsData);
        setPets(petsData);
      } catch (error) {
        console.error("펫 정보 가져오기 실패:", error);
        alert("펫 정보를 불러오는데 실패했습니다.");
      }
    };

    const fetchUserId = async () => {
      try {
          const response = await getUserProfile();
          setUserId(response.data.userIdx);
          setIsKakaoUser(response.data.socialType === "KAKAO"); // 카카오 유저 여부 설정
          fetchEvents(response.data.userIdx);
      } catch (error) {
          console.error("사용자 정보 가져오기 실패:", error);
          alert("사용자 정보를 가져오는데 실패했습니다.");
      }
  };
  

    fetchPets();
    fetchUserId();
  }, [searchParams]);

  const handleKakaoConsent = async (code) => {
    console.log("OAuth Callback 요청 준비 - 전달된 인증 코드:", code);
    try {
        const response = await handleKakaoCallback(code); // API 호출
        console.log("OAuth Callback 처리 성공 - 응답 데이터:", response);
        alert("동의가 완료되었습니다! 다시 이벤트를 저장할 수 있습니다.");
    } catch (error) {
        console.error("OAuth Callback 처리 중 실패:", error);
        alert("동의 처리 중 오류가 발생했습니다.");
    }
};

  
  const fetchEvents = async (userId) => {
    try {
      const response = await getEvents(userId);
      setEvents(response.data);
    } catch (error) {
      console.error("일정 데이터를 불러오는데 실패했습니다:", error);
      alert("일정 데이터를 불러오는데 실패했습니다.");
    }
  };

  const handleDateClick = (date) => {
    setSelectedDate(date);
  };

  const openModal = () => {
    setNewEvent({
      petId: "",
      title: "",
      description: "",
      date: selectedDate,
      time: "12:00",
    });
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewEvent((prev) => ({ ...prev, [name]: value }));
  };

  const handleEventSubmit = async () => {
    if (!userId) {
        alert("사용자 인증 정보가 없습니다.");
        return;
    }

    const dateString = newEvent.date.toISOString().split("T")[0];
    const timeString = newEvent.time;

    const formattedEvent = {
        ...newEvent,
        userId,
        eventDate: dateString,
        eventTime: timeString,
    };

    console.log("보내는 이벤트 데이터:", formattedEvent);

    try {
        const response = await saveEvent(formattedEvent);

        if (isKakaoUser) {
            console.log("카카오톡 메시지 전송 로직 실행");
            // 카카오톡 메시지 전송 로직 추가
        } else {
            console.log("이메일 알림 전송 로직 실행");
            // 이메일 알림 전송 로직 추가
        }

        alert("일정이 저장되었습니다!");
        fetchEvents(userId); // 이벤트 목록 새로고침
        closeModal(); // 모달 닫기
    } catch (error) {
        console.error("일정 저장 실패:", error.response || error);
        alert("일정을 저장하는 데 실패했습니다.");
    }
};


  const handleEventClick = (event) => {
    setSelectedEvent(event);
    setIsEditPanelOpen(true);
  };

  const handleEventUpdate = async () => {
    if (!selectedEvent) return;

    try {
      await updateEvent(selectedEvent.eventId, selectedEvent);
      alert("일정이 수정되었습니다.");
      fetchEvents(userId);
      setIsEditPanelOpen(false);
    } catch (error) {
      console.error("일정 수정 실패:", error);
      alert("일정을 수정하는 데 실패했습니다.");
    }
  };

  const handleEventDelete = async () => {
    if (!selectedEvent) return;

    try {
      await deleteEvent(selectedEvent.eventId);
      alert("일정이 삭제되었습니다.");
      fetchEvents(userId);
      setIsEditPanelOpen(false);
    } catch (error) {
      console.error("일정 삭제 실패:", error);
      alert("일정을 삭제하는 데 실패했습니다.");
    }
  };

  const closeEditPanel = () => {
    setIsEditPanelOpen(false);
    setSelectedEvent(null);
  };

  return (
    <div className="calendar-container">
      <div className="calendar-panel">
        <Calendar
          value={selectedDate}
          onClickDay={handleDateClick}
          className="react-calendar"
          locale="en-US"
          tileContent={({ date }) => {
            const dayEvents = events.filter(
              (event) =>
                new Date(event.eventDate).toDateString() === date.toDateString()
            );

            return (
              <div style={{ position: "relative", height: "100%" }}>
                <abbr>{date.getDate()}</abbr>
                {dayEvents.length > 0 && (
                  <div
                    className="calendar-events"
                    style={{
                      position: "absolute",
                      top: "30px",
                      left: "10px",
                      right: "10px",
                      display: "flex",
                      flexDirection: "column",
                      gap: "5px",
                      zIndex: 2,
                    }}
                  >
                    {dayEvents.map((event) => (
                      <div
                        key={event.eventId}
                        className="calendar-event"
                        onClick={() => handleEventClick(event)}
                        style={{
                          padding: "4px 8px",
                          backgroundColor: "#f0f0f0",
                          border: "1px solid #ccc",
                          borderRadius: "4px",
                          cursor: "pointer",
                          textAlign: "center",
                          userSelect: "none",
                        }}
                      >
                        {event.title}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          }}
        />
        <button className="add-event-btn" onClick={openModal}>
          일정 추가
        </button>
      </div>
      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>일정 추가</h3>
            <label>
              제목:
              <input
                type="text"
                name="title"
                value={newEvent.title}
                onChange={handleInputChange}
              />
            </label>
            <label>
              설명:
              <textarea
                name="description"
                value={newEvent.description}
                onChange={handleInputChange}
              />
            </label>
            <label>
              날짜:
              <input
                type="date"
                name="date"
                value={newEvent.date.toISOString().split("T")[0]}
                onChange={(e) =>
                  setNewEvent((prev) => ({
                    ...prev,
                    date: new Date(e.target.value),
                  }))
                }
              />
            </label>
            <label>
              시간:
              <input
                type="time"
                name="time"
                value={newEvent.time}
                onChange={handleInputChange}
              />
            </label>
            <label>
              펫 선택:
              <select
                name="petId"
                value={newEvent.petId}
                onChange={handleInputChange}
              >
                <option value="">선택</option>
                {pets.map((pet) => (
                  <option key={pet.pet_id} value={pet.pet_id}>
                    {pet.dog_name}
                  </option>
                ))}
              </select>
            </label>
            <button onClick={handleEventSubmit}>저장</button>
            <button onClick={closeModal}>닫기</button>
          </div>
        </div>
      )}

      {isEditPanelOpen && (
        <div className="edit-panel">
          <h3>일정 수정</h3>
          <label>
            제목:
            <input
              type="text"
              value={selectedEvent?.title || ""}
              onChange={(e) =>
                setSelectedEvent((prev) => ({
                  ...prev,
                  title: e.target.value,
                }))
              }
            />
          </label>
          <label>
            설명:
            <textarea
              value={selectedEvent?.description || ""}
              onChange={(e) =>
                setSelectedEvent((prev) => ({
                  ...prev,
                  description: e.target.value,
                }))
              }
            />
          </label>
          <label>
            시간:
            <input
              type="time"
              value={selectedEvent?.eventTime || ""}
              onChange={(e) =>
                setSelectedEvent((prev) => ({
                  ...prev,
                  eventTime: e.target.value,
                }))
              }
            />
          </label>
          <button onClick={handleEventUpdate}>수정</button>
          <button onClick={handleEventDelete}>삭제</button>
          <button onClick={closeEditPanel}>닫기</button>
        </div>
      )}
    </div>
  );
};

export default EventCalendar;
