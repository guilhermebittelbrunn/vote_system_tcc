import {MigrationInterface, QueryRunner} from "typeorm";
import ElectionEntity from "../entities/Election";
import CandidateEntity from "../entities/Candidate";

export class ElectionCandidate1730424338818 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        // Cria a eleição
        const election = await queryRunner.manager.save(ElectionEntity, {
            id: 'a1a1a1a1-1a1a-1a1a-1a1a-1a1a1a1a1a1a',
            title: 'Personagem Favorito',
            description: 'Quem é o personagem de desenho animado mais querido de todos os tempos? Vote no seu favorito e veja quem lidera essa batalha de popularidade! Cada voto traz nostalgia e memórias das animações que marcaram gerações.',
            start_date: new Date('2024-01-01'),
            end_date: new Date('2024-12-01'),
            image: 'lista-completa.jpg',
        });



        // Cria os candidatos relacionados à eleição
        const candidates = [
            {
                id: '5b3df0c1-cc82-4f63-a423-ac5c5781dde5',
                name: 'Mickey Mouse',
                party: 'Disney',
                description: 'O icônico camundongo e símbolo da Disney.',
                election_id: election.id,
                image: 'Mickey_Mouse.png',
                quantity: 0,
            },
            {
                id: '404ba4ed-a0aa-41a6-99a5-ad3b2a50a529',
                name: 'Bob Esponja',
                party: 'Nickelodeon',
                description: 'A esponja amarela otimista e divertida que vive no fundo do mar.',
                election_id: election.id,
                image: 'Bob_Esponja.png',
                quantity: 0,
            },
            {
                id: 'cc725bcb-437d-4d29-bdaa-f8e1068dfaf5',
                name: 'Pikachu',
                party: 'The Pokémon Company',
                description: 'O adorável Pokémon elétrico e parceiro fiel de Ash.',
                election_id: election.id,
                image: 'pikachu.png',
                quantity: 0,
            },
            {
                id: 'da93d984-285e-484f-b441-f29b7edb69a5',
                name: 'Scooby-Doo',
                party: 'Hanna-Barbera',
                description: 'O cão medroso que resolve mistérios junto com seus amigos.',
                election_id: election.id,
                image: 'Scooby-Doo.png',
                quantity: 0,
            },
            {
                id: 'ae2d08b0-79cd-4e50-820f-b91cfe96a458',
                name: 'Tom',
                party: 'MGM Studios',
                description: 'O gato determinado que sempre persegue o rato Jerry.',
                election_id: election.id,
                image: 'Tom_Tom_and_Jerry.png',
                quantity: 0,
            },
            {
                id: '9e764ebd-7fbd-42ab-b190-e1bf45629f52',
                name: 'Homer Simpson',
                party: '20th Century Fox',
                description: 'O pai atrapalhado da famosa série "Os Simpsons".',
                election_id: election.id,
                image: 'capa-homer-e-suas-reacoes.png',
                quantity: 0,
            },
            {
                id: '956d548a-2f5f-47f7-96a2-c6ab0ab1974b',
                name: 'Buzz Lightyear',
                party: 'Disney-Pixar',
                description: 'O corajoso patrulheiro espacial da franquia "Toy Story".',
                election_id: election.id,
                image: 'buzz.png',
                quantity: 0,
            },
            {
                id: 'fda3424e-f68a-47ec-bf10-77549c2f0f6a',
                name: 'Dora Aventureira',
                party: 'Nickelodeon',
                description: 'A pequena exploradora que ensina as crianças sobre o mundo.',
                election_id: election.id,
                image: 'Desenho-da-Dora-a-Aventureira-PNG.png',
                quantity: 0,
            },
            {
                id: '968d553c-9c87-4f2a-8d5e-25e944964780',
                name: 'Pica-Pau',
                party: 'Universal Pictures',
                description: 'O travesso e esperto Pica-Pau, famoso por suas risadas e suas pegadinhas.',
                election_id: election.id,
                image: 'Woody_Woodpecker.png',
                quantity: 0,
            },
            {
                id: 'f51e228e-41b0-48ad-b07f-3d1749c08dce',
                name: 'Homem-Aranha',
                party: 'Marvel',
                description: 'O jovem herói Peter Parker, que usa seus poderes aracnídeos para proteger a cidade de Nova York.',
                election_id: election.id,
                image: 'Spider-Man-Cartoon-Download-PNG-Image.png',
                quantity: 0,
            },
        ];

        // Salva cada candidato no banco de dados
        await queryRunner.manager.save(CandidateEntity, candidates);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        // Remove os candidatos e a eleição caso seja necessário reverter a seed
        const election = await queryRunner.manager.findOne(ElectionEntity, { where: { title: 'Personagem Favorito de Desenhos Animados' } });
        await queryRunner.manager.delete(CandidateEntity, { election_id: election?.id });
        await queryRunner.manager.delete(ElectionEntity, { title: 'Personagem Favorito de Desenhos Animados' });
    }
}
