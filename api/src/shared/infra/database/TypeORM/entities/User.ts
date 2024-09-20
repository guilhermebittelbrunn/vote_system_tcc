import { Entity, Column, BeforeInsert, OneToMany } from 'typeorm';
import { BaseEntity } from '../../../../core/infra/TypeORM/BaseEntity';
import bcrypt from 'bcrypt'
import VoteEntity from './Vote';

@Entity('user')
export default class UserEntity extends BaseEntity {
    @Column()
    name: string;

    @Column()
    email: string;

    @Column({type: 'varchar', nullable: true })
    phone_number?: string | null;

    @Column()
    cpf: string;

    @Column()
    rg: string;

    @Column({ type: 'timestamp' })
    birthday: Date;

    @Column()
    password: string;

    @OneToMany(() => VoteEntity, (vote) => vote.user)
    votes: VoteEntity[];

    @BeforeInsert()
    async createHashPassword() {
        const salt = await bcrypt.genSalt();
        this.password = await bcrypt.hash(this.password, salt);
    }
}
