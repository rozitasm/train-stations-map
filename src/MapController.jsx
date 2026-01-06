import { useEffect } from "react"
import { useMap } from "react-leaflet"

function MapController({center,zoom}){
    const Map=useMap()

    useEffect(()=>{
        if(center && zoom){
            Map.setView(center,zoom)
        }
    },[center,zoom,Map])
    return(
        <>
        </>
    )
}

export default MapController