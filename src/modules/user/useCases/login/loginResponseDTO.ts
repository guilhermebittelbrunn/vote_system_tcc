import User from "@user/domain/user/user";

export default interface LoginResponseDTO {
    user: User;
    token: string;
}
