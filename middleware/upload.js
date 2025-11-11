import multer from "multer";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const UPLOAD_PATH = process.env.UPLOAD_PATH || path.join(__dirname, "../public/uploads");

// Garante que a pasta de uploads exista
if (!fs.existsSync(UPLOAD_PATH)) {
  fs.mkdirSync(UPLOAD_PATH, { recursive: true });
}

// Regras de validação para cada tipo de arquivo
const FILE_RULES = {
  video: {
    allowed: [".mp4", ".mov", ".avi"],
    limit: 100 * 1024 * 1024, // 100MB
    errorExt: "Apenas arquivos MP4, MOV ou AVI são permitidos para o vídeo",
    errorSize: "O vídeo excede o limite de 100 MB",
  },
  thumbnail: {
    allowed: [".jpg", ".jpeg", ".png", ".webp"],
    limit: 5 * 1024 * 1024, // 5MB
    errorExt: "Apenas arquivos JPG, PNG ou WEBP são permitidos para a thumbnail",
    errorSize: "A thumbnail excede o limite de 5 MB",
  },
  foto_criacao: {
    allowed: [".jpg", ".jpeg", ".png", ".webp"],
    limit: 10 * 1024 * 1024, // 10MB
    errorExt: "Apenas arquivos JPG, PNG ou WEBP são permitidos para a foto",
    errorSize: "A foto excede o limite de 10 MB",
  },
};

// Configuração de armazenamento
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, UPLOAD_PATH);
  },
  filename: (req, file, cb) => {
    const nomeUnico = `${Date.now()}-${file.originalname.replace(/\s+/g, "_")}`;
    cb(null, nomeUnico);
  },
});

// Filtro de arquivos
const fileFilter = (req, file, cb) => {
  const regra = FILE_RULES[file.fieldname];
  
  if (!regra) {
    return cb(new Error("Campo de arquivo inválido"));
  }

  const extensao = path.extname(file.originalname).toLowerCase();
  
  if (!regra.allowed.includes(extensao)) {
    return cb(new Error(regra.errorExt));
  }

  cb(null, true);
};

// Cria a instância do multer
const upload = multer({
  storage: storage,
  limits: { fileSize: 100 * 1024 * 1024 }, // Limite global de 100MB
  fileFilter: fileFilter,
});

// Exporta a instância do multer diretamente
export default upload;
