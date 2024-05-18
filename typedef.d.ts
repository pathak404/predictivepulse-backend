declare global {
    namespace Express {
        interface Response {
            sendResponse: (data:Record<string, any>, statusCode: number = 200) => void,
        }

        interface Request {
            userId: string
        }
    }
    
    namespace NodeJS {
        interface ProcessEnv {
            PORT: number,
            SECRET_KEYPHRASE: string,
            MONGODB_URL: string,
        }
    }
}
// treat as module
export {}
