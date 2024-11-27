import {RNS3} from 'react-native-aws3';

export async function uploadFile(fileToUpload) {

    const options = {
        bucket: 'waystory',
        region: 'eu-north-1',
        accessKey: 'AKIAUZPNLSFIAZ577COF',
        secretKey: '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'
    };

    const getFileNameFromUri = () => {

        const segments = fileToUpload.uri.split('/');
        return segments[segments.length - 1];
    };
    const file = {
        uri: fileToUpload.uri,
        name: getFileNameFromUri(),
        type: fileToUpload.type || 'image/png',
    };

    return RNS3
        .put(file, options)
        .then(response => {
            if (response.status !== 201) {
                console.log("Error : ", 'Failed to upload image to S3', response);
                return;
            }
            console.log('Successfully uploaded image to S3', response.body.postResponse.key);
            return response.body.postResponse;
        });
}