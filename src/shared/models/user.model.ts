export interface User {
    uid: string;
    displayName?: string;
    status?: string;
    language?: string;
    email: string;
    phone?: string;
    photoURL?: string;
    location?: string;
    emailVerified?: boolean;
}