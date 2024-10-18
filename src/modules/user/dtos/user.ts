
export default class UserDTO {
    id?: string;
    name: string;
    email: string;
    cpf: string;
    rg: string;
    birthday: Date;
    phoneNumber?: string | null;
    createdAt: Date;
    updatedAt: Date;
    deletedAt?: Date;
}
