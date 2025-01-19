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

    if (response.data?.url) {
      return response.data; // 서버에서 URL 반환
    } else {
      throw new Error("서버 응답이 올바르지 않습니다.");
    }
  } catch (error) {
    console.error("이미지 업로드 실패:", error.response || error.message);
    throw error;
  }
};

export const getPetDetails = async (petId) => {
  const response = await api.get(`/pet/details/${petId}`);
  return response.data;
};

export const savePetDetails = async (details) => {
  const response = await api.post("/pet/details", details);
  return response.data;
};

// 특정 펫의 의료 기록 조회
export const getMedicalRecords = async (petId) => {
  const response = await api.get(`/pet/medical-records/${petId}`);
  return response.data;
};

// 의료 기록 추가
export const addMedicalRecord = async (medicalRecord) => {
  const response = await api.post("/pet/medical-records", medicalRecord);
  return response.data;
};

// 의료 기록 삭제
export const deleteMedicalRecord = async (medicalId) => {
  const response = await api.delete(`/pet/medical-records/${medicalId}`);
  return response.data;
};

// 하루 기록 저장 API
export const saveDailyRecord = async (dailyRecordData) => {
  try {
    const response = await api.post("/pet/daily-records", dailyRecordData);
    return response.data;
  } catch (error) {
    console.error("하루 기록 저장 실패:", error.response?.data || error.message);
    throw error;
  }
};

// 섹션별 하루 기록 조회 API
export const getDailyRecordsBySection = async (petId, section) => {
  try {
    const response = await api.get(`/pet/daily-records/${petId}`, {
      params: { section },
    });
    return response.data;
  } catch (error) {
    console.error(`"${section}" 섹션 기록 불러오기 실패:`, error);
    throw error;
  }
};


// 하루 기록 삭제 API
export const deleteDailyRecord = async (recordId) => {
  try {
    const response = await api.delete(`/pet/daily-records/${recordId}`);
    return response.data;
  } catch (error) {
    console.error("하루 기록 삭제 실패:", error.response || error.message);
    throw error;
  }
};

// 하루 기록 업데이트 API
export const updateDailyRecord = async (recordId, updateData) => {
  try {
    const response = await api.put(`/pet/daily-records/${recordId}`, updateData);
    return response.data;
  } catch (error) {
    console.error("하루 기록 업데이트 실패:", error.response || error.message);
    throw error;
  }
};

// 반려동물 그래프 데이터 가져오기
export const getPetGraphData = async (petId) => {
  try {
      const response = await api.get(`/pet/${petId}/graph-data`);
      return response.data;
  } catch (error) {
      console.error("그래프 데이터 가져오기 실패:", error.response || error.message);
      throw error;
  }
};
