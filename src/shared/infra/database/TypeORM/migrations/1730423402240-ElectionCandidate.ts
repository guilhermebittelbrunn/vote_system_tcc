import { MigrationInterface, QueryRunner } from 'typeorm';
import ElectionEntity from '../entities/Election';
import CandidateEntity from '../entities/Candidate';

export class ElectionCandidate1730423402240 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        // Cria a eleição
        const election = await queryRunner.manager.save(ElectionEntity, {
            id: 'b1b3b3b3-3b3b-3b3b-3b3b-3b3b3b3b3b3b',
            title: 'Superpoder Preferido',
            description: 'Se você pudesse ter um superpoder por um dia, qual escolheria? Vote no seu poder favorito e imagine as possibilidades de um dia cheio de habilidades incríveis!',
            start_date: new Date('2024-01-01'),
            end_date: new Date('2024-12-01'),
            image: 'podercapa.jpg'
        });

        // Cria os candidatos relacionados à eleição
        const candidates = [
            {
                id: 'e21a2c89-29e5-466b-8e18-5ce34408f197',
                name: 'Vôo',
                party: 'Associação de Heróis Aéreos',
                description: 'A habilidade de voar e ver o mundo de cima, explorando novos lugares rapidamente.',
                election_id: election.id,
                image: 'Flying-heroes.jpg',
                quantity: 0,
            },
            {
                id: '0e2141e5-58f1-40d2-bbe8-edd30dab5e94',
                name: 'Invisibilidade',
                party: 'Sociedade dos Invisíveis',
                description: 'A capacidade de se tornar invisível, perfeita para explorar sem ser visto.',
                election_id: election.id,
                image: 'homem-invisivel.jpg',
                quantity: 0,
            },
            {
                id: 'ddb36cf4-87fb-4370-b79f-b9b81dd03ef3',
                name: 'Força Sobre-Humana',
                party: 'Liga dos Fortes',
                description: 'Uma força incrível que permite levantar objetos pesados e realizar feitos extraordinários.',
                election_id: election.id,
                image: '250px-Incredible_Hulk_Vol_3_1_Adams_Variant_Textless.jpg',
                quantity: 0,
            },
            {
                id: '57f70fd5-9b85-4668-964d-34a001944417',
                name: 'Teletransporte',
                party: 'Aliança dos Viajantes Instantâneos',
                description: 'Mover-se instantaneamente de um lugar para outro, sem perder tempo com deslocamento.',
                election_id: election.id,
                image: 'teleportation-portals.jpg',
                quantity: 0,
            },
            {
                id: '9466363b-8e75-4148-8e75-d357122231ff',
                name: 'Leitura de Mentes',
                party: 'Ordem dos Leitores de Pensamento',
                description: 'A habilidade de ler pensamentos e entender o que os outros estão pensando.',
                election_id: election.id,
                image: 'ff9dcc51de94445f482c52b9d9.jpg',
                quantity: 0,
            },
        ];

        // Salva cada candidato no banco de dados
        await queryRunner.manager.save(CandidateEntity, candidates);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        // Remove os candidatos e a eleição caso seja necessário reverter a seed
        const election = await queryRunner.manager.findOne(ElectionEntity, { where: { title: 'Superpoder Preferido para um Dia' } });
        await queryRunner.manager.delete(CandidateEntity, { election_id: election?.id });
        await queryRunner.manager.delete(ElectionEntity, { title: 'Superpoder Preferido para um Dia' });
    }
}
