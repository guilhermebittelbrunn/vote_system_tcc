import User from "@user/domain/user/user";

export default interface LoginGestaoResponseDTO {
    user: User;
    token: string;
}
