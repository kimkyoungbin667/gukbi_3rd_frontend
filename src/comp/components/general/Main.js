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
        1: { left: "1080px", top: "525px" },
        2: { right: "1400px", top: "1375px" },
        3: { right: "800px", top: "2200px" },
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
                        <div className="caption">일상을 스마트하게..</div>
                    </div>
                </div>


                {hoveredItem === 1 && (
                    <div className="postit" style={{ ...postitPositions[1], ...animationStyle }}>
                        <img src={postit} alt="postit" className="postit-img" />
                        <p className="postit-text">
                            <span className="highlight-text">오늘 얼마나 걸었을까요?</span> <br />
                            산책 기록과 칼로리 소모량 등을 <br />
                            AI가 분석해  반려동물의 건강을 <br />
                            스마트하게 관리해보세요!
                        </p>
                    </div>
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
                        <div className="caption">소중한 일상을 기록하며..</div>
                    </div>
                </div>

                {hoveredItem === 2 && (
                    <div className="postit" style={{ ...postitPositions[2], ...animationStyle }}>
                        <img src={postit} alt="postit" className="postit-img" />
                        <p className="postit-text">
                            <span className="highlight-text">내 아이의 소중한 성장 이야기</span> <br />
                            매일 달라지는 반려동물의 변화, <br />
                            일상의 작은 순간들이 쌓여가는  <br /> 
                            모습을 한눈에 확인하고 특별하게 <br /> 
                            기록해보세요!
                        </p>
                    </div>
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
                    <div className="postit" style={{ ...postitPositions[3], ...animationStyle }}>
                        <img src={postit} alt="postit" className="postit-img" />
                        <p className="postit-text">
                            <span className="highlight-text">같은 마음, 같은 이야기</span> <br />
                            다른 반려인들과 소통하며 <br />
                            정보를 나누고, 소중한 추억을 <br />
                            함께 만들어보세요!
                        </p>
                    </div>
                )}

            </div>
        </div>
    );
}

export default Main;
