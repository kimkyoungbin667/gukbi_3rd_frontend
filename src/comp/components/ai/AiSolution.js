import React, { useEffect, useState } from "react";
import '../../css/ai/aisolution.css';
import animalBoard from '../../../assets/img/ai/dd.png';
import animalPost from '../../../assets/img/ai/animalPost.png';
import { getAnimalList } from "../../api/ai";

function AiSolution() {
  const [animalData, setAnimalData] = useState([]);

  useEffect(() => {
    getAnimalList()
      .then(res => {
        console.log(res.data);
        setAnimalData(res.data);
      })
      .catch(err => {
        console.log(err);
      });
  }, []);

  return (
    <div className="ai-solution-container">
      <p className="ai-solution-main-title">🤖 AI 솔루션 </p>

      {/* Board 이미지 안에 안내 문구 배치 */}
      <div className="ai-solution-board">
        <img src={animalBoard} className="animal-board-background" alt="Animal Board" />



        {/* 안내 문구를 Board 안쪽 맨 위에 배치 */}
        <div className="ai-solution-choice-inside">
          <p>👉 솔루션할 반려동물을 선택해주세요</p>
        </div>

        {/* map으로 카드 생성 */}
        {animalData.map((animal, index) => (
          <div className="ai-solution-card" key={index} style={{ top: `${index * 40 + 10}%`, left: `${(index % 2) * 40 + 13}%` }}>
            <img src={animalPost} className="ai-solution-background" alt="Animal Card" />


            <div className="animal-info">
              <img src={`http://58.74.46.219:33334/upload/${animal.imageUrl}`} alt="반려동물 사진" className="my-animal-picture" />
              <p className="my-animal-name">{animal.name}</p>
              <p className="my-animal-age">{animal.age}세</p>
              <p className="my-animal-kind">{animal.breed}</p>
              <button type="button" className="start-ai-solution btnPush btnLightBlue">
                솔루션 시작
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default AiSolution;
