import { useState } from "react";
import { CustomOverlayMap, MapMarker, Polyline } from "react-kakao-maps-sdk";

export default function MapWalkPolyline(props) {

    const [walkInfoWindow, setWalkInfoWindow] = useState(null);

    const walks = props.walks;
    const category = props.category;
    return (
        <>
            {category === "산책기록" && walks.map((walk, index) => (
                <>
                    <Polyline key={index}
                        path={[walk.paths.map((path, index) => (

                            { lat: path.latitude, lng: path.longitude }
                        ))

                        ]}
                        strokeWeight={10}
                        strokeColor={"#FFAE00"}
                        strokeOpacity={1}
                        strokeStyle={"solid"}
                        endArrow
                        onClick={() => { setWalkInfoWindow(walk); }}
                    ></Polyline>
                    <MapMarker position={{ lat: walk.paths[0].latitude, lng: walk.paths[0].longitude }} onClick={() => { setWalkInfoWindow(walk); }}></MapMarker>

                </>

            ))
            }
            {walkInfoWindow && (
                <CustomOverlayMap
                    position={{
                        lat: walkInfoWindow.paths[0].latitude, lng: walkInfoWindow.paths[0].longitude
                    }}>
                    <div className="bubble">
                        <div className="title">
                            <div className="">{walkInfoWindow.walkName}</div>


                            {/* '닫기' 버튼 */}
                            <button className="xbox" onClick={() => setWalkInfoWindow(null)}></button>
                        </div>

                        <div className="content">{walkInfoWindow.startTime}</div>
                        <div className="content">{walkInfoWindow.endTime}</div>
                        <div className="content">{walkInfoWindow.distance}Km</div>
                        <div className="content">{walkInfoWindow.duration}분</div>


                    </div>


                </CustomOverlayMap>


            )

            }


        </ >
    )
}