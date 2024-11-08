export interface IUser {
    id?: string;
    external_id: string;
    username: string;
    first_name: string;
    last_name: string;
    email: string;
    password: string;
    location?: object;
    createdAt: Date;
    updatedAt: Date;
}

export interface IUserInput {
    id?: string;
    external_id: string;
    username: string;
    first_name: string;
    last_name: string;
    email: string;
    password: string;
    location?: object;
}
export interface IFrontUser {
    username: string;
    email: string;
    password: string;
    location: object;
}
