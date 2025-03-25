import AWS from 'aws-sdk';
import { aws_arn, aws_s3_name } from '../util/const.js';

AWS.config.credentials = new AWS.TemporaryCredentials({
    RoleArn: aws_arn,
    RoleSessionName: 'S3SignedUrlGenerationSession'
});

const s3 = new AWS.S3();

function generateSignedUrl(objectKey) {
    // Generate signed URL
    const params = {
        Bucket: aws_s3_name,
        Key: 'pdfs/test.pdf',
        Expires: 3600 // URL expiration time in seconds
    };

    const signedUrl = s3.getSignedUrl('getObject', params);
}

export { generateSignedUrl }


