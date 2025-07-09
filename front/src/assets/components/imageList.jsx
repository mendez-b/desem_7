import { useEffect, useState } from "react"
import axios from "axios"

const ImageList = () => {
  const [images, setImages] = useState([])

  useEffect(() => {
    async function fetchImages() {
      try {
        const res = await axios.get("http://localhost:3001/images")
        setImages(res.data)
      } catch (error) {
        console.log("Error obteniendo imágenes", error)
      }
    }

    fetchImages() 
  }, []) 

  return (
    <div>
      <h2>Lista de imágenes</h2>
      <ul style={{ listStyle: "none", padding: 0, display: "flex", flexWrap: "wrap" }}>
        {images.map(image => (
          <li key={image.id} style={{ margin: "10px" }}>
            <img src={image.fileUrl} alt={`Imagen ${image.id}`} width="250" />
          </li>
        ))}
      </ul>
    </div>
  )
}

export default ImageList
