import React, { useState, useEffect } from "react";
import { getPetInfo, savePetInfo } from "../../api/pet";
import { getUserProfile } from "../../api/user"; // 사용자 프로필 가져오기 API
import { useNavigate } from "react-router-dom"; // useNavigate 훅 import
import "../../css/pet/PetRegistration.css"; // CSS 파일 추가

function PetRegistration() {
  const [dogRegNo, setDogRegNo] = useState("");
  const [rfidCd, setRfidCd] = useState("");
  const [ownerNm, setOwnerNm] = useState("");
  const [ownerBirth, setOwnerBirth] = useState("");
  const [userIdx, setUserIdx] = useState(null); // 사용자 ID 상태
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false); // 모달 상태 추가

  const navigate = useNavigate(); // useNavigate 훅을 사용하여 페이지 이동

  // 기본 이미지 URL 설정
  const defaultImageUrl = "https://i.pinimg.com/736x/df/e3/bf/dfe3bfb04d99e860dbdefaa1a5cb3c71.jpg"; // 기본 이미지 URL을 여기에 설정

  // 사용자 ID 가져오기
  useEffect(() => {
    const fetchUserId = async () => {
      try {
        const response = await getUserProfile();
        setUserIdx(response.data.userIdx); // 사용자 ID 설정
      } catch (error) {
        console.error("사용자 정보 가져오기 실패:", error.message);
        alert("사용자 정보를 가져오는 데 실패했습니다.");
      }
    };

    fetchUserId();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!dogRegNo || !ownerNm || !userIdx) {
      alert("동물등록번호, 소유자 성명, 사용자 ID는 필수 입력 항목입니다.");
      return;
    }

    setLoading(true);
    setResults(null);

    try {
      const data = await getPetInfo({
        dogRegNo,
        rfidCd,
        ownerNm,
        ownerBirth,
      });
      setResults(data);
      setIsModalOpen(true); // 모달 열기
    } catch (error) {
      console.error("API 호출 실패:", error.response || error.message);
      alert("데이터 조회 실패");
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!results || !results.response || !results.response.body || !results.response.body.item) {
      alert("저장할 데이터가 없습니다.");
      return;
    }

    setSaving(true);

    try {
      const petData = {
        ...results.response.body.item,
        user_idx: userIdx, // 저장 시 사용자 ID 추가
        imageUrl: results.response.body.item.imageUrl || defaultImageUrl, // 이미지 URL이 없으면 기본 이미지 사용
      };
      await savePetInfo(petData);
      alert("데이터가 성공적으로 저장되었습니다.");
      navigate("/mypetspage"); // 저장 후 /mypetspage로 이동
    } catch (error) {
      console.error("저장 실패:", error.response || error.message);
      alert("데이터 저장 실패");
    } finally {
      setSaving(false);
      setIsModalOpen(false); // 모달 닫기
    }
  };

  return (
    <div className="registration-container">
      <h1 className="registration-title">반려동물 정보 조회</h1>
      <form className="registration-form" onSubmit={handleSubmit}>
        <div className="registration-form-group">
          <label>동물등록번호:</label>
          <input
            type="text"
            placeholder="동물등록번호"
            value={dogRegNo}
            onChange={(e) => setDogRegNo(e.target.value)}
            required
          />
        </div>
        <div className="registration-form-group">
          <label>RFID 코드:</label>
          <input
            type="text"
            placeholder="RFID 코드"
            value={rfidCd}
            onChange={(e) => setRfidCd(e.target.value)}
          />
        </div>
        <div className="registration-form-group">
          <label>소유자 성명:</label>
          <input
            type="text"
            placeholder="소유자 성명"
            value={ownerNm}
            onChange={(e) => setOwnerNm(e.target.value)}
            required
          />
        </div>
        <div className="registration-form-group">
          <label>소유자 생년월일 (주민등록번호 앞자리):</label>
          <input
            type="text"
            placeholder="소유자 생년월일"
            value={ownerBirth}
            onChange={(e) => setOwnerBirth(e.target.value)}
          />
        </div>
        <button type="submit" className="registration-submit-button" disabled={loading}>
          {loading ? "조회 중..." : "조회하기"}
        </button>
      </form>

      {/* 모달 창 */}
      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2 className="results-title">조회 결과</h2>
            
            <p><strong>이름:</strong> {results.response.body.item.dogNm}</p>
            <p><strong>성별:</strong> {results.response.body.item.sexNm}</p>
            <p><strong>품종:</strong> {results.response.body.item.kindNm}</p>
            <p><strong>중성화 여부:</strong> {results.response.body.item.neuterYn}</p>
            <p><strong>등록 기관:</strong> {results.response.body.item.orgNm}</p>
            <p><strong>등록 기관 전화번호:</strong> {results.response.body.item.officeTel}</p>
            <p><strong>승인 상태:</strong> {results.response.body.item.aprGbNm}</p>

            <div className="results-button-group">
              <button className="save-button" onClick={handleSave} disabled={saving}>
                {saving ? "저장 중..." : "저장"}
              </button>
              <button className="cancel-button" onClick={() => setIsModalOpen(false)}>
                취소
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default PetRegistration;
