import api from "../ax/axiosSetting";


export const getWalks = (obj) => {
    return api.post('/map/walkRoutes/getWalks', JSON.stringify(obj));
}

export const getAcommpanyDetails = () => {
    return api.get('/map/getPetAccompanyDetail');
}






export const addCategoryFav = (obj) => {
    return api.post('/map/category/addFavorite', JSON.stringify(obj));
}

export const getCategoryFav = (obj) => {
    return api.post('/map/category/getFavorite', JSON.stringify(obj));
}

export const deleteCategoryFav = (obj) => {
    return api.post('/map/category/deleteFavorite', JSON.stringify(obj));
}








export const addAccompanyFav = (obj) => {
    return api.post('/map/accompany/addFavorite', JSON.stringify(obj));
}

export const getAccompanyFav = (obj) => {
    return api.post('/map/accompany/getFavorite', JSON.stringify(obj));
}

export const deleteAccompanyFav = (obj) => {
    return api.post('/map/accompany/deleteFavorite', JSON.stringify(obj));
}


export const getPetLists = (obj) => {
    return api.post('map/getPetInfo', JSON.stringify(obj));
}
