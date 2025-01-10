import api from "../ax/axiosSetting";

// 반려동물 정보 조회 API 호출
export const getPetInfo = async ({ dogRegNo, rfidCd, ownerNm, ownerBirth }) => {
  try {
    const response = await api.get("/pet/pet-info", {
      params: {
        dogRegNo,
        rfidCd,
        ownerNm,
        ownerBirth,
      },
    });

    return response.data;
  } catch (error) {
    console.error("반려동물 정보 조회 실패:", error.response || error.message);
    throw error;
  }
};

// 반려동물 정보 저장 API 호출
export const savePetInfo = async (petData) => {
  try {
    const response = await api.post("/pet/save-pet-info", petData);
    return response.data;
  } catch (error) {
    console.error("반려동물 정보 저장 실패:", error.response || error.message);
    throw error;
  }
};

// 사용자 펫 정보 가져오기
export const getMyPets = async () => {
  try {
    const response = await api.get("/pet/my-pets");
    return response.data;
  } catch (error) {
    console.error("펫 정보 가져오기 실패:", error.response || error.message);
    throw error;
  }
};

// 펫 정보 삭제
export const deletePet = async (petId) => {
  try {
    const response = await api.delete(`/pet/${petId}`);
    return response.data;
  } catch (error) {
    console.error("펫 삭제 실패:", error.response || error.message);
    throw error;
  }
};

// 반려동물 사진 업로드 API 호출
export const uploadPetImage = async (petId, formData) => {
  try {
    const response = await api.post(`/pet/${petId}/upload-image`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  } catch (error) {
    console.error("이미지 업로드 실패:", error.response || error.message);
    throw error;
  }
};
