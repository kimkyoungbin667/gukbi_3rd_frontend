import React, { useState, useEffect } from "react";
import cat from '../../../assets/img/ai/cat.png';
import chilpan from '../../../assets/img/ai/chilpan.png';
import '../../css/ai/aichat.css'

function AiChat() {
  const [prompt, setPrompt] = useState("");
  const [response, setResponse] = useState("");
  const [isLoading, setIsLoading] = useState(false);  // ✅ 로딩 상태 추가
  const [loadingText, setLoadingText] = useState("답변 중");  // ✅ 로딩 텍스트 상태 추가

  const token = localStorage.getItem("token");

  // ✅ 로딩 애니메이션 (답변 중... 반복)
  useEffect(() => {
    let interval;
    if (isLoading) {
      let dotCount = 0;
      interval = setInterval(() => {
        dotCount = (dotCount + 1) % 4;  // 0~3 반복
        setLoadingText("답변 중" + ".".repeat(dotCount));
      }, 500);  // 0.5초마다 변경
    } else {
      setLoadingText("답변 중");  // 로딩 종료 시 초기화
    }

    return () => clearInterval(interval);  // 컴포넌트 언마운트 시 정리
  }, [isLoading]);

  const handleSubmit = async () => {
    if (!prompt) return;

    setIsLoading(true);  // ✅ 로딩 시작

    try {
      const res = await fetch("http://58.74.46.219:33334/api/ai/chat/cat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({ prompt: prompt })
      });

      if (!res.ok) {
        throw new Error(`서버 오류: ${res.status}`);
      }

      const data = await res.text();
      setResponse(data);
    } catch (error) {
      console.error("Error:", error);
      setResponse("응답을 가져오는 데 실패했습니다.");
    }

    setIsLoading(false);  // ✅ 로딩 종료
    setPrompt("");
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <div className="ai-container">
      <p className="ai-title">💬 AI 야옹과 대화하기</p>

      <div className="ai-resultarea">
        <div>
          {isLoading ? (
            <p className="loading-text">{loadingText}</p>  // ✅ 로딩 중 메시지
          ) : response === "" ? (
            <p className="what-question">질문이 뭐다냥?</p>
          ) : (
            response
          )}
        </div>
      </div>

      <img src={cat} className="ai-cat" alt="AI 야옹" />

      <div className="ai-input-text-area">
        <textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          onKeyDown={handleKeyPress}
          rows="5"
          cols="50"
          placeholder="질문을 입력해주세요.. (Shift + Enter는 줄바꿈)"
        />
        <button onClick={handleSubmit} disabled={isLoading}>  {/* ✅ 로딩 중 버튼 비활성화 */}
          {isLoading ? "답변 중..." : "질문하기"}
        </button>
      </div>

      <img src={chilpan} alt="칠판" />
    </div>
  );
}

export default AiChat;
