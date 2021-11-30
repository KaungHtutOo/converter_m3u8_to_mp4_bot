import fs from 'fs';
import aws from 'aws-sdk';

const {DEFAULT_DIR, SPACE_NAME, SPACE_ENDPOINT} = process.env;

// Set S3 endpoint to DigitalOcean Spaces
const spacesEndpoint = new aws.Endpoint(SPACE_ENDPOINT);
const s3 = new aws.S3({
	endpoint: spacesEndpoint,
});

export async function saveToSpaces(fileName) {
	try {
		const fileContent = await fs.readFileSync(fileName);
		const start = Date.now();
		console.log('====================================');
		console.log('fileContent', fileContent);
		console.log('====================================');
		const params = {
			Bucket: SPACE_NAME,
			Key: `${DEFAULT_DIR}/${fileName}`,
			Body: fileContent,
			ACL: 'public-read',
		};
		const data = await s3.putObject(params).promise();
		console.log('====================================');
		console.log('data', data);
		console.log('====================================');
		await fs.unlinkSync(fileName);
		const time = (Date.now() - start) / 1000;
		console.log('\nDownload complete', data);
		console.log(`\ndone, thanks - ${time}s`);
		return {...data, time, url: `https://${SPACE_NAME}.${SPACE_ENDPOINT}/${params.Key}`};
	} catch (error) {
		throw new Error(error);
	}
}
