import fs from 'fs/promises';
import path from 'path';

export async function filesInDir(dir, ignoreList = [], fullPath = false) {
  try {
    const files = await fs.readdir(dir);
    return {
      folder: dir.split('/').pop(),
      content: files
        .map(file => {
          if (ignoreList.includes(file)) {
            return null;
          }
          return fullPath ? path.join(dir, file) : file;
        })
        .filter(Boolean)
    }
  } catch (error) {
    console.error(`Error reading directory ${dir}:`, error);
    throw error;
  }
}