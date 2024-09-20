import { Entity, Column } from 'typeorm';
import { BaseEntity } from '../../../../core/infra/TypeORM/BaseEntity';

@Entity('election')
export default class ElectionEntity extends BaseEntity {
    @Column()
    title: string;

    @Column('text')
    description: string;

    @Column('timestamp')
    start_date: Date;

    @Column('timestamp')
    end_date: Date;
}
