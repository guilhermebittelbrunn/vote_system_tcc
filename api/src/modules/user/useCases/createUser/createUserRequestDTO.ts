import UserDTO from '@user/dtos/user';

interface CreateUserRequestDTO
    extends Omit<UserDTO, 'id' | 'createdAt' | 'updatedAt' | 'deletedAt'> {
    password?: string;
}

export default CreateUserRequestDTO;
