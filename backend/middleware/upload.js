import multer from 'multer';
import multerS3 from 'multer-s3';
import { S3Client } from '@aws-sdk/client-s3';

const s3 = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY,
    secretAccessKey: process.env.AWS_SECRET_KEY,
  },
});

const uploadKYCImage = multer({
  storage: multerS3({
    s3,
    bucket: process.env.S3_PUBLIC_BUCKET,
    contentType: multerS3.AUTO_CONTENT_TYPE,
    key: (req, file, cb) => {
      const ext = file.originalname.split('.').pop();
      const uniqueName = `kyc/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
      console.log('Generated S3 key:', uniqueName);
      cb(null, uniqueName);
    },
  }),
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    if (!file.mimetype.startsWith('image/')) {
      return cb(new Error('Only image files are allowed!'), false);
    }
    cb(null, true);
  },
});

export default uploadKYCImage.single('imgUrl'); // Or .fields([{ name: 'image' }])
