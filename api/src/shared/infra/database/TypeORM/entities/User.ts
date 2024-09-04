import { Entity, Column, PrimaryGeneratedColumn, BeforeInsert } from 'typeorm';
import { BaseEntity } from '../../../../core/infra/TypeORM/BaseEntity';
import bcrypt from 'bcrypt'


@Entity('users')
export default class UserEntity extends BaseEntity {
    @Column()
    name: string;

    @Column({ unique: true })
    email: string;

    @Column({ unique: true, nullable: true })
    phone_number?: string | null;

    @Column({ unique: true })
    cpf: string;

    @Column({ unique: true })
    rg: string;

    @Column({ type: 'timestamp' })
    birthday: Date;

    @Column()
    password: string;

    @BeforeInsert()
    async createHashPassword() {
        const salt = await bcrypt.genSalt();
        this.password = await bcrypt.hash(this.password, salt);
    }
}
