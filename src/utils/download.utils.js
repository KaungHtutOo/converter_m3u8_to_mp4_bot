import { v4 as uuid } from 'uuid';
import dotenv from 'dotenv';
import Converter from './converter.utils.js';
import { saveToSpaces } from './aws.utils.js';
import { logger } from './logger.utils.js';

dotenv.config();

const converter = new Converter();
export async function download(m3uPath, ctx) {
  logger.info(m3uPath);

  try {
    const newFileName = uuid();
    const fileNameInput = `${newFileName}.mp4`;
    logger.info('fileNameInput', fileNameInput);
    console.log('m3uPath', m3uPath);
    await converter.setInputFile(m3uPath)
      .setOutputFile(fileNameInput)
      .setContext(ctx)
      .start();
    const result = await saveToSpaces(fileNameInput);
    return { result };
  } catch (error) {
    const message = 'Error!';
    const errorData = { error: { message, data: error } };
    logger.error(errorData);
    throw new Error(message);
  }
}

export default download;
