import React from 'react';
import { Map } from "react-kakao-maps-sdk";

export default function KakaoMap() {
    return (
        <Map id="map" center={{ lat: 33.450701, lng: 126.570667 }}
            style={{ width: '100%', height: '1000px' }}
            level={3}
        />



    )
}