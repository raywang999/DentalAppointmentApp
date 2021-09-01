const { createWriteStream, unlink } = require('fs');
const shortId = require('shortid');
const path = require('path');
const UPLOAD_DIRECTORY_URL = require('../config/UPLOAD_DIRECTORY_URL');

const features = {
  /**
   * Stores a GraphQL file upload in the filesystem.
   * @param {Promise<object>} upload GraphQL file upload.
   * @returns {Promise<object>} Resolves the upload as our graphql File type.
   */
  storeUpload: async (upload) => {
    const { createReadStream, filename, mimetype, encoding } = await upload.promise;
    const stream = createReadStream();
    const storedFileName = `${shortId.generate()}-${filename}`;
    const storedFileUrl = path.join(UPLOAD_DIRECTORY_URL, storedFileName);

    // Store the file in the filesystem.
    await new Promise((resolve, reject) => {
      // Create a stream to which the upload will be written.
      const writeStream = createWriteStream(storedFileUrl);

      // When the upload is fully written, resolve the promise.
      writeStream.on('finish', resolve);

      // If there's an error writing the file, remove the partially written file
      // and reject the promise.
      writeStream.on('error', (error) => {
        unlink(storedFileUrl, () => {
          reject(error);
        });
      });

      // In Node.js <= v13, errors are not automatically propagated between piped
      // streams. If there is an error receiving the upload, destroy the write
      // stream with the corresponding error.
      stream.on('error', (error) => writeStream.destroy(error));

      // Pipe the upload into the write stream.
      stream.pipe(writeStream);
    });

    return { filename: storedFileName, encoding, mimetype };
  },
  storeMultipleUploads: async (files) => {
    if (!files) files = []; //ensure files is a list
    // Ensure an error storing one upload doesn’t prevent storing the rest.
    const results = await Promise.allSettled(files.map(features.storeUpload));
    return results.reduce((storedFiles, { value, reason }) => {
      if (value) storedFiles.push(value);
      // Realistically you would do more than just log an error.
      else console.error(`Failed to store upload: ${reason}`);
      return storedFiles;
    }, []);
  }
}

module.exports = features;
