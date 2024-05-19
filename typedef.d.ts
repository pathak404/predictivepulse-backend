declare global {
    namespace Express {
        interface Response {
            sendResponse: (data:{
                message?: string;
                [kay:string]: any;
            }, statusCode: number = 200) => void;
        }

        interface Request {
            userId: string;
            nonce: string;
        }
    }
    
    namespace NodeJS {
        interface ProcessEnv {
            PORT: number;
            SECRET_KEYPHRASE: string;
            MONGODB_URL: string;
            MOJO_CLIENT_ID: string;
            MOJO_CLIENT_SECRET: string;
            MOJO_API_URL: string;
            FRONTEND_URL: string;
            MAIL_ADDRESS: string;
            MAIL_PASSWORD: string;
            MAIL_HOST: string;
            MAIL_PORT: number;
        }
    }
}
// treat as module
export {}
