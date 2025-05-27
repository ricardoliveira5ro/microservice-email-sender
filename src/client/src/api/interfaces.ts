export interface Signup {
    email: string;
    username: string;
    password: string;
}

export interface Login {
    email: string;
    password: string;
    captchaValue: string;
}