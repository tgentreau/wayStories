export type UserLogin = {
    email: string;
    password: string;
}

export type UserSignin = {
    name: string;
    email: string;
    password: string;
}

export type SignInFormInputs = {
    username: string;
    email: string;
    password: string;
    confirmPassword: string;
};

export type UserProfilEdited = {
    profilePictureLink?: string;
    username?: string;
    email?: string;
    password?: string;
    biographie?: string;
}