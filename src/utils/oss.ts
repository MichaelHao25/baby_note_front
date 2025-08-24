import COS from "cos-js-sdk-v5";
import dayjs from "dayjs";
import { store } from "../store";
import { apiSlice } from "../store/apiSlice";
import type { CosStsData } from "../types/api";

const BUCKET = "ourschool-1310179193";
const REGION = "ap-shanghai";

async function getOssConfig(): Promise<CosStsData> {
    const cachedConfig = localStorage.getItem("oss_config");
    if (cachedConfig) {
        const configJson = JSON.parse(cachedConfig) as CosStsData;
        // Add a 5-second buffer to the expiration time
        if (configJson.ExpiredTime > Date.now() / 1000 + 5) {
            return configJson;
        }
    }

    const result = await store.dispatch(
        apiSlice.endpoints.getCosSts.initiate(),
    );

    if (result.data?.code === 1) {
        localStorage.setItem("oss_config", JSON.stringify(result.data.data));
        return result.data.data;
    } else {
        throw new Error(result.data?.msg ?? "Failed to get OSS config");
    }
}

function getFilePath(fileName: string) {
    const now = dayjs();
    const yearMonth = now.format("YYYYMM");
    const dateTime = now.format("YYYYMMDDHHmmss");
    const randomFileName = fileName.replace(/[^a-zA-Z0-9.]/g, "");
    return `te/${yearMonth}/${dateTime}_${randomFileName}`;
}

export interface UploadResult {
    url: string;
    fileName: string;
}

export const uploadByOss = (
    file: File,
    onProgress?: (progress: number) => void,
): Promise<UploadResult> => {
    return new Promise(async (resolve, reject) => {
        try {
            const config = await getOssConfig();
            const cos = new COS({
                getAuthorization: (options, callback) => {
                    callback({
                        TmpSecretId: config.Credentials.TmpSecretId,
                        TmpSecretKey: config.Credentials.TmpSecretKey,
                        SecurityToken: config.Credentials.Token,
                        StartTime: config.StartTime,
                        ExpiredTime: config.ExpiredTime,
                    });
                },
            });

            cos.putObject(
                {
                    Bucket: BUCKET,
                    Region: REGION,
                    Key: getFilePath(file.name),
                    Body: file,
                    onProgress: (progressData) => {
                        onProgress?.(progressData.percent * 100);
                    },
                },
                (err, data) => {
                    if (err) {
                        return reject(err);
                    }
                    resolve({
                        url: `https://${data.Location}`,
                        fileName: file.name,
                    });
                },
            );
        } catch (error) {
            reject(error);
        }
    });
};
