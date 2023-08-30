import multer from 'multer';
import path from 'path';
import { Request } from 'express';
const currentDir = process.cwd();
const storage = multer.diskStorage({
  destination: (_req: Request, _file: Express.Multer.File, cb) => {
    cb(null, path.join(currentDir, '/src/uploads'));
  },
  filename: (_req: Request, file: Express.Multer.File, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const extension = path.extname(file.originalname);
    const filename = `${file.fieldname}-${uniqueSuffix}${extension}`;
    cb(null, filename);
  },
});

export const handleImageUpload = multer({
  storage: storage,
}).single('profile_pic');
