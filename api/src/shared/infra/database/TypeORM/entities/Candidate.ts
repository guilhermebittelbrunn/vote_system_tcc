import { Entity, Column, ManyToOne, JoinColumn, CreateDateColumn } from 'typeorm';
import ElectionEntity from './Election';
import { BaseEntity } from '@core/infra/TypeORM/BaseEntity';

@Entity('candidate')
export default class CandidateEntity extends BaseEntity {

    @Column()
    name: string;

    @Column()
    party: string;

    @CreateDateColumn()
    created_at: Date;

    @Column('uuid', { nullable: true })
    election_id?: string;

    @ManyToOne(() => ElectionEntity, (election) => election.candidates)
    election: ElectionEntity;
}
