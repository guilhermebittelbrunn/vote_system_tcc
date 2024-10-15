import { Entity, ManyToOne, Column, PrimaryGeneratedColumn, CreateDateColumn, JoinColumn } from 'typeorm';
import ElectionEntity from './Election';
import UserEntity from './User';
import { VoteStatusEnum } from '@root-shared/types/vote';

@Entity('vote')
export default class VoteEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column('uuid')
    election_id: string;

    @Column('uuid', {name: 'user_id'})
    user_id: string;

    @Column({ type: 'varchar', length: 255, nullable: true })
    block_hash?: string | null;

    @Column({ type: 'varchar', length: 30 })
    status: VoteStatusEnum;

    @CreateDateColumn()
    created_at: Date;

    @ManyToOne(() => UserEntity, (user) => user.votes)
    @JoinColumn({ name: 'user_id' })
    user: UserEntity;

    @ManyToOne(() => ElectionEntity, (election) => election.votes)
    @JoinColumn({ name: 'election_id' })
    election: ElectionEntity;
}
