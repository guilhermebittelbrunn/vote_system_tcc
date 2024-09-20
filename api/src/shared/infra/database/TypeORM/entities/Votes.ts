import { Entity, ManyToOne, JoinColumn, Column } from 'typeorm';
import ElectionEntity from './Election';
import { BaseEntity } from '@core/infra/TypeORM/BaseEntity';

@Entity('vote')
export default class VoteEntity extends BaseEntity {

    @Column('uuid')
    election_id: string;

    @Column({ type: 'varchar', length: 256 })
    block_hash: string;

    @ManyToOne(() => ElectionEntity)

    @JoinColumn({ name: 'election_id' })
    election: ElectionEntity;
}
