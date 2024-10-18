import BaseRepository from '@core/infra/TypeORM/BaseRepository';
import CandidateEntity from '@database/TypeORM/entities/Candidate';
import Candidate from 'modules/candidate/domain/candidate/candidate';
import CandidateMapper from 'modules/candidate/mappers/candidate';
import ICandidateRepository from '../ICandidateRepository';

export default class CandidateRepository extends BaseRepository<CandidateEntity, Candidate> implements ICandidateRepository {
    mapper = CandidateMapper;
z
    entity = CandidateEntity;

    usesSoftDelete = false;

}
