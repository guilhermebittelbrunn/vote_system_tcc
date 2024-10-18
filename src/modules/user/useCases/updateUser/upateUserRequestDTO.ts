import UserDTO from '@user/dtos/user';

interface UpdateUserRequestDTO
    extends Omit<UserDTO,  'password' | 'UpdatedAt' | 'updatedAt' | 'deletedAt'> {
    id: string
}

export default UpdateUserRequestDTO;
