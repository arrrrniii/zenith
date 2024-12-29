// pages/api/upload.js

import formidable from 'formidable';
import fs from 'fs/promises';
import path from 'path';
import sharp from 'sharp';

export const config = {
  api: {
    bodyParser: false,
  },
};

const uploadDir = path.join(process.cwd(), 'public', 'uploads');

// Convert image to WEBP with 100% quality
const convertToWebP = async (file) => {
  const timestamp = Date.now();
  const baseName = file.originalFilename.replace(/\.[^.]+$/, '');
  const fileName = `${timestamp}-${baseName}.webp`;
  const newPath = path.join(uploadDir, fileName);

  try {
    const data = await fs.readFile(file.filepath);

    // Convert directly to webp at 100% quality, no resizing
    const webpBuffer = await sharp(data)
      .webp({ quality: 100 })
      .toBuffer();

    await fs.writeFile(newPath, webpBuffer);

    return `/uploads/${fileName}`;
  } catch (error) {
    console.error('Error converting image:', error);
    throw error;
  } finally {
    await fs.unlink(file.filepath);
  }
};

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    await fs.mkdir(uploadDir, { recursive: true });

    const form = formidable({
      uploadDir: uploadDir,
      keepExtensions: true,
      multiples: true,
      maxFileSize: 100 * 1024 * 1024,
    });

    form.parse(req, async (err, fields, files) => {
      if (err) {
        console.error('Error parsing form:', err);
        return res.status(500).json({ error: 'Error uploading file' });
      }

      const uploadedFiles = Array.isArray(files.files) ? files.files : [files.files];
      if (uploadedFiles.length === 0) {
        return res.status(400).json({ error: 'No files uploaded' });
      }

      try {
        const filePaths = await Promise.all(
          uploadedFiles.map((file) => convertToWebP(file))
        );
        return res.status(200).json({ filePaths });
      } catch (error) {
        console.error('Error saving files:', error);
        return res.status(500).json({ error: 'Error saving files' });
      }
    });
  } catch (error) {
    console.error('Error in upload handler:', error);
    return res.status(500).json({ error: 'Error uploading files' });
  }
}
