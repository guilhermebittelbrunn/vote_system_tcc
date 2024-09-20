import { Entity, ManyToOne, JoinColumn, Column, OneToMany, PrimaryGeneratedColumn, CreateDateColumn } from 'typeorm';
import ElectionEntity from './Election';
import { BaseEntity } from '@core/infra/TypeORM/BaseEntity';
import UserEntity from './User';

@Entity('vote')
export default class VoteEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column('uuid')
    election_id: string;

    @Column('uuid')
    user_id: string;

    @Column({ type: 'varchar', length: 256 })
    block_hash: string;

    @CreateDateColumn()
    created_at: Date;

    @ManyToOne(() => UserEntity, (user) => user.votes)
    user: UserEntity;

    @ManyToOne(() => ElectionEntity, (election) => election.votes)
    election: ElectionEntity;


}
