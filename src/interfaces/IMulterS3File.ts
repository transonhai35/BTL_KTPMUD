export interface IMulterS3File {
    fieldname?: string;
    /** Name of the file on the user's computer */
    originalname: string;
    /** Encoding type of the file */
    encoding?: string;
    /** Mime type of the file */
    mimetype: string;
    /** Size of the file in bytes */
    size: number;
    /** The acl to which the file has been saved (DiskStorage) */
    acl?: string;
    /** The bucket to which the file has been saved (DiskStorage) */
    bucket: string;
    /** The object key of the file within the bucket (DiskStorage) */
    key: string;
    /** Location of the uploaded file (DiskStorage) */
    location?: string;
}