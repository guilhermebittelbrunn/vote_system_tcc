import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import ElectionEntity from './Election';
import { BaseEntity } from '@core/infra/TypeORM/BaseEntity';

@Entity('candidates')
export default class CandidateEntity extends BaseEntity {

    @Column()
    name: string;

    @Column()
    party: string;

    @Column('uuid', { nullable: true })
    election_id?: string;

    @ManyToOne(() => ElectionEntity)
    @JoinColumn({ name: 'election_id' })
    election: ElectionEntity;
}
