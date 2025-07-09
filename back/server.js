const express = require("express")
const cors = require("cors")
const multer = require("multer")
const path = require("path")
const mysql = require("mysql2")

const app = express()
app.use(cors())
app.use(express.json())

app.use("/uploads", express.static(path.join(__dirname, 'uploads')))

const connection = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "dbimages"
})

connection.query(`CREATE TABLE IF NOT EXISTS images (
    id INT AUTO_INCREMENT PRIMARY KEY,
    file_path VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
)`, (err) => {
    if (err) {
        console.error("Error al crear la tabla", err)
    }
})

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/')
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
        cb(null, uniqueSuffix + path.extname(file.originalname))
    },
})

const upload = multer({ storage: storage })

app.post("/upload", upload.single("image"), (req, res) => {
    if (!req.file) {
        return res.status(400).json({ message: "No se subió ningún archivo" })
    }

    const filePath = `uploads/${req.file.filename}`
    connection.query(`INSERT INTO images(file_path) VALUES (?)`, [filePath], (err, results) => {
        if (err) {
            console.log("Error al guardar la ruta del archivo en la bd", err)
            return res.status(500).json({ message: "Error al guardar la ruta del archivo" })
        }
        res.json({
            message: "Archivo subido correctamente",
            fileUrl: `http://localhost:3001/${filePath}`
        })
    })
})

app.get("/images", (req, res) => {
    connection.query("SELECT * FROM images", (err, results) => {
        if (err) {
            console.log("Error al obtener los datos de las imágenes", err)
            return res.status(500).json({ message: "Error al obtener las imágenes" })
        }

        const imageWithUrl = results.map(image => ({
            ...image,
            fileUrl: `http://localhost:3001/${image.file_path}`
        }))
        res.json(imageWithUrl)
    })
})

const PORT = 3001
app.listen(PORT, () => {
    console.log(`El servidor está corriendo en puerto ${PORT}`)
})
