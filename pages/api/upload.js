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

const resizeAndSaveImage = async (file) => {
  const timestamp = Date.now();
  const fileName = `${timestamp}-${file.originalFilename}`;
  const newPath = path.join(uploadDir, fileName);

  try {
    // Read the uploaded file data
    const data = await fs.readFile(file.filepath);

    // Use sharp to resize the image
    const resizedImageBuffer = await sharp(data)
      .resize({ width: 1000, withoutEnlargement: true })
      .toBuffer();

    // Write the resized image to the upload directory
    await fs.writeFile(newPath, resizedImageBuffer);

    return `/uploads/${fileName}`;
  } catch (error) {
    console.error('Error resizing and saving image:', error);
    throw error;
  } finally {
    // Delete the temporary file
    await fs.unlink(file.filepath);
  }
};

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Ensure upload directory exists
    await fs.mkdir(uploadDir, { recursive: true });

    const form = formidable({
      uploadDir: uploadDir,
      keepExtensions: true,
      multiples: true, // Allow multiple file uploads
      maxFileSize: 100 * 1024 * 1024, // 100MB limit (adjust as needed)
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
          uploadedFiles.map((file) => resizeAndSaveImage(file))
        );
        res.status(200).json({ filePaths });
      } catch (error) {
        console.error('Error saving files:', error);
        res.status(500).json({ error: 'Error saving files' });
      }
    });
  } catch (error) {
    console.error('Error in upload handler:', error);
    res.status(500).json({ error: 'Error uploading files' });
  }
}
