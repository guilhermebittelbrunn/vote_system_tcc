import { Entity, Column, OneToMany } from 'typeorm';
import { BaseEntity } from '../../../../core/infra/TypeORM/BaseEntity';
import VoteEntity from './Vote';
import CandidateEntity from './Candidate';

@Entity('election')
export default class ElectionEntity extends BaseEntity {
    @Column()
    title: string;

    @Column('text')
    description: string;

    @Column('text', { nullable: true })
    image: string;

    @Column('timestamp')
    start_date: Date;

    @Column('timestamp')
    end_date: Date;

    @OneToMany(() => VoteEntity, (vote) => vote.election)
    votes: VoteEntity[];

    @OneToMany(() => CandidateEntity, (candidate) => candidate.election)
    candidates: CandidateEntity[];
}
