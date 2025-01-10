import { useState } from "react";
import { CustomOverlayMap, MapMarker, Polyline } from "react-kakao-maps-sdk";

export default function MapWalkPolyline(props) {

    const [walkInfoWindow, setWalkInfoWindow] = useState(null);

    const walks = props.walks;
    const category = props.category;
    return (
        <>
            {category === "ㅎㅇ" && walks.map((walk, index) => (
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

                        <span className="left">{walkInfoWindow.walkName}</span>
                        <button className="xbox" onClick={() => setWalkInfoWindow()}></button><br />
                        <span className="center">{walkInfoWindow.startTime}</span><br />
                        <span className="center">{walkInfoWindow.endTime}</span><br />
                        <span className="center">{walkInfoWindow.distance}Km</span><br />
                        <span className="center">{walkInfoWindow.duration}분</span><br />


                    </div>
                </CustomOverlayMap>


            )

            }


        </ >
    )
}