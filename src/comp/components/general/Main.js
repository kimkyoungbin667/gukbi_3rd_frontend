import React, { useState, useEffect } from "react";
import "../../css/general/main.css";
import walking from "../../../assets/img/main/walking.jpg";
import care from "../../../assets/img/main/care.jpg";
import community from "../../../assets/img/main/community.jpg";
import postit from "../../../assets/img/main/postit.png";

function Main() {
    const [hoveredItem, setHoveredItem] = useState(null);
    const [animationStyle, setAnimationStyle] = useState({});

    // 포스트잇 흔들림 애니메이션 (자바스크립트로 구현)
    useEffect(() => {
        let animationInterval;

        if (hoveredItem) {
            animationInterval = setInterval(() => {
                setAnimationStyle((prevStyle) => {
                    const randomRotate = (Math.random() - 0.5) * 3; // -1.5도 ~ 1.5도 회전
                    const randomTranslateY = -50 + (Math.random() - 0.5) * 2; // -51% ~ -49% 이동
                    return {
                        transform: `translateY(${randomTranslateY}%) rotate(${randomRotate}deg) scale(1.05)`,
                        opacity: 1,
                        transition: "transform 0.3s ease-in-out",
                    };
                });
            }, 500); // 0.5초마다 변화
        } else {
            setAnimationStyle({
                opacity: 0,
                transform: "translateY(-10%) scale(1)",
                transition: "transform 0.5s ease-in-out",
            });
        }

        return () => clearInterval(animationInterval);
    }, [hoveredItem]);

    // 포스트잇 위치 설정 (아이템별 위치 다르게)
    const postitPositions = {
        1: { left: "1080px", top: "500px" },
        2: { right: "300px", top: "500px" },
        3: { left: "600px", top: "550px" },
    };

    return (
        <div className="main-container">
            <div className="wrapper">
                {/* 첫 번째 아이템 */}
                <div
                    className="item"
                    style={{ marginLeft: "-500px", marginBottom: "300px" }}
                    onMouseEnter={() => setHoveredItem(1)}
                    onMouseLeave={() => setHoveredItem(null)}
                >
                    <div className="polaroid">
                        <img src={walking} alt="walking" />
                        <div className="caption">행복하고 건강한 일상</div>
                    </div>
                </div>

                {hoveredItem === 1 && (
                    <img
                        src={postit}
                        alt="postit"
                        className="postit"
                        style={{ ...postitPositions[1], ...animationStyle }}
                    />
                )}

                {/* 두 번째 아이템 */}
                <div
                    className="item"
                    style={{ marginLeft: "500px", marginBottom: "300px" }}
                    onMouseEnter={() => setHoveredItem(2)}
                    onMouseLeave={() => setHoveredItem(null)}
                >
                    <div className="polaroid">
                        <img src={care} alt="care" />
                        <div className="caption">소중한 하루</div>
                    </div>
                </div>

                {hoveredItem === 2 && (
                    <img
                        src={postit}
                        alt="postit"
                        className="postit"
                        style={{ ...postitPositions[2], ...animationStyle }}
                    />
                )}

                {/* 세 번째 아이템 */}
                <div
                    className="item"
                    style={{ marginLeft: "-500px", marginBottom: "300px" }}
                    onMouseEnter={() => setHoveredItem(3)}
                    onMouseLeave={() => setHoveredItem(null)}
                >
                    <div className="polaroid">
                        <img src={community} alt="community" />
                        <div className="caption">함께라서 더 행복한 순간</div>
                    </div>
                </div>

                {hoveredItem === 3 && (
                    <img
                        src={postit}
                        alt="postit"
                        className="postit"
                        style={{ ...postitPositions[3], ...animationStyle }}
                    />
                )}
            </div>
        </div>
    );
}

export default Main;
