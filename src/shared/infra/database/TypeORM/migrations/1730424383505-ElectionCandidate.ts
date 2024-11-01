import { MigrationInterface, QueryRunner } from 'typeorm';
import ElectionEntity from '../entities/Election';
import CandidateEntity from '../entities/Candidate';

export class ElectionCandidate1730424383505 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        // Cria a eleição
        const election = await queryRunner.manager.save(ElectionEntity, {
            id: 'd2d2d2d2-2d2d-2d2d-2d2d-2d2d2d2d2d2d',
            title: 'Destino de Férias dos Sonhos',
            description: 'Qual destes lugares você escolheria para passar as férias dos sonhos? Vote no seu destino favorito e descubra qual é o mais popular! De praias paradisíacas a metrópoles culturais, escolha o local perfeito para relaxar e explorar.',
            start_date: new Date('2024-01-01'),
            end_date: new Date('2024-12-01'),
            image: 'viagemcapa.jpg'
        });


        // Cria os candidatos relacionados à eleição
        const candidates = [
            {
                id: '33cfdad4-da90-499a-a163-741fe424557d',
                name: 'Paris, França',
                party: 'FR',
                description: 'A cidade do amor, famosa pela Torre Eiffel e seus cafés charmosos.',
                election_id: election.id,
                image: 'passagens-aereas-paris-capa2019-02.jpg',
                quantity: 0,
            },
            {
                id: '4ea45375-ed8f-4f6f-9883-4175f9da7f6e',
                name: 'Ilhas Maldivas',
                party: 'MV',
                description: 'Um paraíso tropical com águas cristalinas e praias de areia branca.',
                election_id: election.id,
                image: 'maldivas.jpeg',
                quantity: 0,
            },
            {
                id: '97e6febe-14d2-402b-a4ac-c59056a62fd3',
                name: 'Nova York, EUA',
                party: 'US',
                description: 'A cidade que nunca dorme, conhecida por seus arranha-céus e atrações como a Times Square.',
                election_id: election.id,
                image: 'Estados-Unidos-Nova-York-shutterstock_248799484.jpg',
                quantity: 0,
            },
            {
                id: 'a1fa22c0-2886-4215-ad93-20015b376654',
                name: 'Tóquio, Japão',
                party: 'JP',
                description: 'A capital vibrante do Japão, uma mistura única de tradição e modernidade.',
                election_id: election.id,
                image: 'toquio.jpeg',
                quantity: 0,
            },
            {
                id: '96319c7e-fd84-4b18-b392-cde11ffb31b1',
                name: 'Veneza, Itália',
                party: 'IT',
                description: 'A romântica cidade dos canais, famosa por suas gôndolas e arquitetura renascentista.',
                election_id: election.id,
                image: 'veneza-card.jpg',
                quantity: 0,
            },
            {
                id: '268d6c56-8617-442b-9a43-e7ed00f2200a',
                name: 'Sydney, Austrália',
                party: 'AU',
                description: 'A cidade icônica da Austrália, conhecida pela Ópera de Sydney e praias incríveis.',
                election_id: election.id,
                image: 'curiosidades-sobre-sydney-capa-1.jpg',
                quantity: 0,
            },
        ];

        // Salva cada candidato no banco de dados
        await queryRunner.manager.save(CandidateEntity, candidates);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        // Remove os candidatos e a eleição caso seja necessário reverter a seed
        const election = await queryRunner.manager.findOne(ElectionEntity, { where: { title: 'Destino de Férias dos Sonhos' } });
        await queryRunner.manager.delete(CandidateEntity, { election_id: election?.id });
        await queryRunner.manager.delete(ElectionEntity, { title: 'Destino de Férias dos Sonhos' });
    }
}
