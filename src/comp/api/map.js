import api from "../ax/axiosSetting";


export const getWalks = (obj) => {
    return api.post('/map/walkRoutes/getWalks', JSON.stringify(obj));
}
