import { Entity, Column, ManyToOne, JoinColumn, CreateDateColumn } from 'typeorm';
import ElectionEntity from './Election';
import { BaseEntity } from '@core/infra/TypeORM/BaseEntity';

@Entity('candidate')
export default class CandidateEntity extends BaseEntity {

    @Column()
    name: string;

    @Column({ nullable: true })
    party: string;

    @CreateDateColumn()
    created_at: Date;

    @Column('uuid')
    election_id: string;

    @Column({ nullable: true })
    description: string;

    @Column({ default: 0 })
    quantity: number;

    @ManyToOne(() => ElectionEntity, (election) => election.candidates)
    @JoinColumn({ name: 'election_id' })
    election: ElectionEntity;
}
