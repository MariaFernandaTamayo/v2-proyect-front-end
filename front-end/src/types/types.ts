export interface AuthResponse {
    body: {
        user: User;
        accessToken: string;
        refreshToken: string;
    };
}

export interface AuthResponseError {
    body: {
        error: string;
    };
}

export interface User {
    _id: string;
    email: string;
    username: string;
}

export interface AccessTokenResponse {
    statusCode: number;
    accessToken: string;
    body: {
        accessToken: string;
    };
    error?: string;
}

export interface Tweet {
    _id: string;
    title: string;
    content: string; // Assuming a content field for the tweet
    username: string;
    idUser: string;
}