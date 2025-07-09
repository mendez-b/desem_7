import { useState, useEffect } from 'react'
import axios from 'axios'
import './App.css'

function App() {
  const [selectedFile, setSelectedFile] = useState(null)
  const [previewUrl, setPreviewUrl] = useState(null)
  const [images, setImages] = useState([])

  const handleFileChange = (e) => {
    const file = e.target.files[0]
    if (!file) {
      setPreviewUrl(null)
      setSelectedFile(null)
      return
    }

    setSelectedFile(file)
    setPreviewUrl(URL.createObjectURL(file))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!selectedFile) {
      return alert("Debes seleccionar un archivo")
    }

    const formData = new FormData()
    formData.append("image", selectedFile)

    try {
      const response = await axios.post("http://localhost:3001/upload", formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      })
      console.log(response.data)
      setSelectedFile(null)
      setPreviewUrl(null)
      fetchImages() // Actualiza la galería
    } catch (error) {
      console.error("Error al subir la imagen", error)
    }
  }

  const fetchImages = async () => {
    try {
      const response = await axios.get("http://localhost:3001/images")
      setImages(response.data)
    } catch (error) {
      console.error("Error al obtener las imágenes", error)
    }
  }

  useEffect(() => {
    fetchImages()
  }, [])

  return (
    <div style={{ padding: '20px' }}>
      <h1>Subir imagen</h1>
      <form onSubmit={handleSubmit} style={{ marginBottom: '20px' }}>
        <input type="file" accept="image/*" onChange={handleFileChange} />
        {previewUrl && (
          <div style={{ marginTop: '10px' }}>
            <img src={previewUrl} alt="Vista previa" width="250" />
          </div>
        )}
        <button type="submit" style={{ display: 'block', marginTop: '10px' }}>
          Subir imagen
        </button>
      </form>

      <h2>Galería de Imágenes</h2>
      <div style={{
        display: 'flex',
        flexWrap: 'wrap',
        gap: '15px'
      }}>
        {images.map((img) => (
          <img key={img.id} src={img.fileUrl} alt={`img-${img.id}`} width="200" />
        ))}
      </div>
    </div>
  )
}

export default App
