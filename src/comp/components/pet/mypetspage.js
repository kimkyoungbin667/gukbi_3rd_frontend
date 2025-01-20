import React, { useEffect, useState } from "react";
import { getMyPets, deletePet, uploadPetImage } from "../../api/pet";
import { useNavigate } from "react-router-dom";
import "../../css/pet/MyPetsPage.css";
import PetDetails from "./pet_details";
import MedicalHistory from "./medical_histoy";
import PetDailyRecord from "./petdaily_recored";
import PetGraph from "./PetGraph";

function MyPetsPage() {
  const [pets, setPets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingPetId, setEditingPetId] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [isValidImage, setIsValidImage] = useState(true);
  const [message, setMessage] = useState("");
  const [expandedPetId, setExpandedPetId] = useState(null);
  const [activeTab, setActiveTab] = useState({});
  const navigate = useNavigate();

  const fetchPets = async () => {
    setLoading(true);
    try {
      const petData = await getMyPets();
      setPets(petData);
    } catch (error) {
      console.error("펫 정보 로드 실패:", error.message);
      setMessage("펫 정보를 로드하는 데 실패했습니다.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPets();
  }, []);

  const handleDelete = async (petId) => {
    if (!window.confirm("정말로 삭제하시겠습니까?")) return;

    try {
      await deletePet(petId);
      await fetchPets();
      setMessage("펫이 성공적으로 삭제되었습니다.");
    } catch (error) {
      console.error("펫 삭제 실패:", error.message);
      setMessage("펫 삭제에 실패했습니다.");
    }
  };

  const validateImage = (file) => {
    const validExtensions = ["jpg", "jpeg", "png", "gif", "bmp", "webp"];
    const fileExtension = file.name.split(".").pop().toLowerCase();

    if (!file.type.startsWith("image/") || !validExtensions.includes(fileExtension)) {
      setIsValidImage(false);
      alert("유효하지 않은 이미지 형식입니다.");
      return false;
    }

    setIsValidImage(true);
    return true;
  };

  const handleImageUpload = async () => {
    if (!selectedImage?.file) {
      alert("이미지를 선택해주세요.");
      return;
    }

    const formData = new FormData();
    formData.append("file", selectedImage.file);

    try {
      const response = await uploadPetImage(editingPetId, formData);

      if (response.url) {
        setMessage("이미지가 성공적으로 업로드되었습니다.");
        window.location.reload();
      }
    } catch (error) {
      console.error("이미지 업로드 실패:", error.message);
      setMessage("이미지 업로드에 실패했습니다.");
    } finally {
      setEditingPetId(null);
      setSelectedImage(null);
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file && validateImage(file)) {
      const previewUrl = URL.createObjectURL(file);

      setSelectedImage({ file, previewUrl });

      setPets((prevPets) =>
        prevPets.map((pet) =>
          pet.pet_id === editingPetId
            ? { ...pet, profile_url: previewUrl }
            : pet
        )
      );
    }
  };

  const toggleDetails = (petId) => {
    setExpandedPetId((prevId) => (prevId === petId ? null : petId));
    setActiveTab((prev) => ({ ...prev, [petId]: "details" }));
  };

  const changeTab = (petId, tab) => {
    setActiveTab((prev) => ({ ...prev, [petId]: tab }));
  };

  const cancelEdit = () => {
    setSelectedImage(null);
    setEditingPetId(null);
    window.location.reload();
  };

  const handleAddPet = () => {
    navigate("/petregistration");
  };

  if (loading) return <p className="mypets-page-loading">로딩 중...</p>;

  return (
    <div className="mypets-page-container">
      <h1 className="mypets-page-title">🐶내 반려동물 목록😺</h1>
      <button className="mypets-page-add-pet-button" onClick={handleAddPet}>
        동물 등록하기
      </button>
      <div className="mypets-page-list">
        {pets.map((pet) => (
          <div key={pet.pet_id} className="mypets-page-card">
            <div className="mypets-page-info">
              <img
                key={editingPetId === pet.pet_id ? selectedImage?.previewUrl || pet.profile_url : pet.profile_url}
                src={
                  editingPetId === pet.pet_id && selectedImage?.previewUrl
                    ? selectedImage.previewUrl
                    : `http://localhost:8080${pet.profile_url}`
                }
                alt={pet.dog_name}
                className="mypets-page-image"
              />
              <div className="mypets-page-details">
                <p>이름: {pet.dog_name}</p>
                <p>품종: {pet.kind_name}</p>
                <p>성별: {pet.sex}</p>
                <p>중성화 여부: {pet.neuter_status}</p>
                {editingPetId === pet.pet_id ? (
                  <div>
                    <label htmlFor={`file-input-${pet.pet_id}`} className="mypets-page-custom-file-label">
                      파일 선택
                    </label>
                    <input
                      id={`file-input-${pet.pet_id}`}
                      type="file"
                      className="mypets-page-custom-file-input"
                      onChange={handleImageChange}
                    />
                    {!isValidImage && <p style={{ color: "red" }}>유효하지 않은 이미지입니다.</p>}
                    <button className="mypets-page-button upload" onClick={handleImageUpload}>
                      업로드
                    </button>
                    <button className="mypets-page-button cancel" onClick={cancelEdit}>
                      취소
                    </button>
                  </div>
                ) : (
                  <button
                    className="mypets-page-button edit"
                    onClick={() => setEditingPetId(pet.pet_id)}
                  >
                    수정
                  </button>
                )}

                <button className="mypets-page-button delete" onClick={() => handleDelete(pet.pet_id)}>
                  삭제
                </button>
                <button className="mypets-page-button toggle" onClick={() => toggleDetails(pet.pet_id)}>
                  {expandedPetId === pet.pet_id ? "▲" : "▼"}
                </button>
              </div>
            </div>

            {expandedPetId === pet.pet_id && (
              <div className="mypets-page-extra-details">
                <div className="mypets-page-tabs">
                  <button
                    className={`mypets-page-tab ${
                      activeTab[pet.pet_id] === "details" ? "active" : ""
                    }`}
                    onClick={() => changeTab(pet.pet_id, "details")}
                  >
                    상세 정보
                  </button>
                  <button
                    className={`mypets-page-tab ${
                      activeTab[pet.pet_id] === "weeklyGraph" ? "active" : ""
                    }`}
                    onClick={() => changeTab(pet.pet_id, "weeklyGraph")}
                  >
                    주간 그래프
                  </button>
                  <button
                    className={`mypets-page-tab ${
                      activeTab[pet.pet_id] === "dailyRecord" ? "active" : ""
                    }`}
                    onClick={() => changeTab(pet.pet_id, "dailyRecord")}
                  >
                    오늘의 기록
                  </button>
                  <button
                    className={`mypets-page-tab ${
                      activeTab[pet.pet_id] === "medicalHistory" ? "active" : ""
                    }`}
                    onClick={() => changeTab(pet.pet_id, "medicalHistory")}
                  >
                    의료 기록
                  </button>
                </div>
                {activeTab[pet.pet_id] === "details" && <PetDetails petId={pet.pet_id} />}
                {activeTab[pet.pet_id] === "weeklyGraph" && <PetGraph petId={pet.pet_id} />}
                {activeTab[pet.pet_id] === "dailyRecord" && <PetDailyRecord petId={pet.pet_id} />}
                {activeTab[pet.pet_id] === "medicalHistory" && <MedicalHistory petId={pet.pet_id} />}
              </div>
            )}
          </div>
        ))}
      </div>
      {message && <p className="mypets-page-success-message">{message}</p>}
    </div>
  );
}

export default MyPetsPage;
