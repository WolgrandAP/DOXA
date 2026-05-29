import { type SQLiteDatabase } from "expo-sqlite";

export async function initializeDatabase(database: SQLiteDatabase) {
    try {
        await database.execAsync(`
            PRAGMA journal_mode = WAL;
            PRAGMA foreign_keys = ON;
        `);

        //Na tabela posts a coluna "author" está redundante devido a presença do user_id que a partir dele se descobre p author
        await database.execAsync(`
            CREATE TABLE IF NOT EXISTS users (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                name TEXT NOT NULL,
                email TEXT NOT NULL UNIQUE,
                password TEXT NOT NULL,
                handle TEXT NOT NULL UNIQUE,
                bio TEXT,
                avatarUrl TEXT,
                bannerUrl TEXT,
                followers INTEGER DEFAULT 0,
                following INTEGER DEFAULT 0,
                is_synced INTEGER DEFAULT 0
            );

            CREATE TABLE IF NOT EXISTS communities (
                id TEXT PRIMARY KEY,
                name TEXT NOT NULL UNIQUE,
                members TEXT DEFAULT '0',
                description TEXT,
                is_joined INTEGER DEFAULT 0,
                creator_id INTEGER,
                banner_url TEXT,
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                is_synced INTEGER DEFAULT 0
            );

            CREATE TABLE IF NOT EXISTS posts (
                id TEXT PRIMARY KEY,
                user_id INTEGER,
                author TEXT NOT NULL, 
                title TEXT NOT NULL,
                description TEXT NOT NULL,
                subject TEXT,
                tag TEXT,
                role TEXT,
                time TEXT,
                image_url TEXT,
                upvotes INTEGER DEFAULT 0,
                comments_count INTEGER DEFAULT 0,
                is_saved INTEGER DEFAULT 0,
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                is_synced INTEGER DEFAULT 0,
                FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
            );

            CREATE TABLE IF NOT EXISTS comments (
                id TEXT PRIMARY KEY,
                post_id TEXT NOT NULL,
                user_id INTEGER NOT NULL,
                text TEXT NOT NULL,
                time TEXT,
                likes INTEGER DEFAULT 0,
                isLiked INTEGER DEFAULT 0,
                replies TEXT DEFAULT '[]',
                is_synced INTEGER DEFAULT 0,
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (post_id) REFERENCES posts (id) ON DELETE CASCADE,
                FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
            );

            CREATE TABLE IF NOT EXISTS user_saved_posts (
                user_id INTEGER NOT NULL,
                post_id TEXT NOT NULL,
                PRIMARY KEY (user_id, post_id),
                FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE,
                FOREIGN KEY (post_id) REFERENCES posts (id) ON DELETE CASCADE
            );

            CREATE TABLE IF NOT EXISTS user_communities (
                user_id INTEGER NOT NULL,
                community_id TEXT NOT NULL,
                PRIMARY KEY (user_id, community_id),
                FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE,
                FOREIGN KEY (community_id) REFERENCES communities (id) ON DELETE CASCADE
            );

            CREATE TABLE IF NOT EXISTS user_follows (
                follower_id INTEGER NOT NULL,
                followed_id INTEGER NOT NULL,
                PRIMARY KEY (follower_id, followed_id),
                FOREIGN KEY (follower_id) REFERENCES users (id) ON DELETE CASCADE,
                FOREIGN KEY (followed_id) REFERENCES users (id) ON DELETE CASCADE
            );
        `);

        await database.execAsync(`
            INSERT OR IGNORE INTO users (id, name, handle, bio, avatarUrl, bannerUrl, followers, following, email, password)
            VALUES 
            (1, 'João Victor', '@joaov', 'Desenvolvedor Full Stack apaixonado por tecnologia. Criando a rede DOXA 🚀', 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=800&auto=format&fit=crop', 'https://images.unsplash.com/photo-1604871000636-074fa5117945?q=80&w=2000&auto=format&fit=crop', 1240, 342, 'joao@gmail.com', '123456'),
            (2, 'Outros Autores', '@outros', 'Usuário genérico para outros autores', 'https://ui-avatars.com/api/?name=Outros&background=random', 'https://images.unsplash.com/photo-1604871000636-074fa5117945?q=80&w=2000&auto=format&fit=crop', 0, 0, 'outros@gmail.com', '123456');

            INSERT OR IGNORE INTO communities (id, name, members, description, is_joined, creator_id)
            VALUES
            ('dev_pt',      'd://dev_pt',        '15.2k',  'Comunidade para desenvolvedores que falam português. Compartilhe código, dúvidas e conquistas.', 1, 2),
            ('tecnologia',  'd://tecnologia',    '248k',   'Discussões sobre o mundo da tecnologia: gadgets, tendências, inovações e futuro digital.', 1, 2),
            ('filosofia',   'd://filosofia',     '32.7k',  'Explore grandes questões da existência humana. Debates sobre ética, metafísica e epistemologia.', 1, 2),
            ('politica_br', 'd://politica_br',   '89.1k',  'Debate político brasileiro com respeito e argumentos. Fuja do extremismo, entre na conversa.', 0, 2),
            ('ciencia',     'd://ciencia',       '113k',   'Divulgação científica, papers recentes, descobertas e discussões sobre o método científico.', 0, 2),
            ('ia_brasil',   'd://ia_brasil',     '41.5k',  'Inteligência Artificial em português: LLMs, agentes, ética em IA, tutoriais e novidades do setor.', 1, 2),
            ('psicologia',  'd://psicologia',    '27.3k',  'Saúde mental, comportamento humano, teorias psicológicas e recursos de autoconhecimento.', 0, 2),
            ('astronomia',  'd://astronomia',    '56.8k',  'O universo nos fascina. Exoplanetas, buracos negros, missões espaciais e astrofísica para todos.', 0, 2),
            ('economia',    'd://economia',      '73.4k',  'Macroeconomia, finanças pessoais, mercado financeiro, criptos e análise econômica brasileira.', 0, 2),
            ('historia',    'd://historia',      '18.9k',  'Da antiguidade ao contemporâneo. Análise histórica, revisionismo e aprendizados do passado.', 0, 2),
            ('literatura',  'd://literatura',    '22.1k',  'Recomendações, análises e debates sobre livros, autores e movimentos literários nacionais e mundiais.', 0, 2),
            ('jogos',       'd://jogos',         '195k',   'Games, esports, retrogaming, reviews e tudo que o mundo dos jogos eletrônicos tem a oferecer.', 0, 2);

            INSERT OR IGNORE INTO posts (id, user_id, author, title, description, subject, tag, role, time, upvotes, comments_count)
            VALUES
            ('post_1',  1, 'João Victor',    'Qual a melhor linguagem para iniciantes em 2026?',            'Estou em dúvida entre Python e Go. O que o mercado está pedindo mais atualmente para vagas Junior? Tenho 6 meses de estudo e quero focar em backend.',                                               'd://dev_pt',      '#discussão',    'Desenvolvedor',          '1 h',    42,  15),
            ('post_2',  1, 'João Victor',    'Novo processador quântico atinge estabilidade comercial',    'A IBM anunciou ontem um processador quântico de 1000 qubits com taxa de erro abaixo de 0.1%. Isso pode mudar completamente a forma como lidamos com criptografia na web.',                       'd://tecnologia',  '#news',         'Desenvolvedor',          '5 h',   890, 142),
            ('post_3',  2, 'Mariana Costa',  'O livre arbítrio existe ou é uma ilusão?',                  'Após ler "Free Will" do Sam Harris, fiquei com a sensação de que toda escolha é apenas o resultado de processos físicos anteriores. Como vocês reconciliam isso com a responsabilidade moral?',   'd://filosofia',   '#debate',       'Filósofa',               '2 h',   234,  67),
            ('post_4',  2, 'Rafael Mendes',  'Claude 4 vs GPT-5: qual está ganhando na prática?',         'Testei os dois por 3 semanas em tarefas reais de desenvolvimento. Claude 4 se sai melhor em raciocínio de código, GPT-5 domina criatividade textual. Detalhes no comentário.',                  'd://ia_brasil',   '#review',       'Engenheiro de ML',       '30 m',  567,  89),
            ('post_5',  2, 'Fernanda Lima',  'STF e a democracia: onde está o equilíbrio?',               'Independente de posição política, precisamos discutir os limites institucionais do poder judiciário num regime democrático. O ativismo judicial é um risco ou uma necessidade?',                  'd://politica_br', '#debate',       'Jurista',                '4 h',   412,  201),
            ('post_12', 1, 'João Victor',    'TypeScript 6.0 chegou e está incrível',                     'A nova versão traz inferência de tipos muito mais poderosa, decorators nativos e integração direta com o Wasm GC. Fiz um tutorial rápido do que muda no dia a dia. Link nos comentários.',          'd://dev_pt',      '#tutorial',     'Desenvolvedor',          '45 m',  321,  56),
            ('post_16', 2, 'Rafael Mendes',  'React Native vs Flutter em 2026: qual escolher?',           'Depois de projetos reais nos dois, minha conclusão: Flutter para apps com UI pesada e performance crítica, RN para times que já dominam React/TS e precisam de integração nativa rápida.',           'd://dev_pt',      '#discussão',    'Engenheiro Mobile',      '1 h',   234,  67);

            -- Sincroniza herança de IDs para posts antigos (caso necessário)
            UPDATE posts SET user_id = 2 WHERE id IN ('post_3', 'post_4', 'post_5', 'post_16');

            INSERT OR IGNORE INTO comments (id, post_id, author, avatar, text, time, likes)
            VALUES
            ('comment_1',  'post_1',  'Carlos Neto',    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200', 'Python definitivamente para iniciantes. A sintaxe limpa ajuda a focar na lógica sem se preocupar com tipos.', '45 m', 18),
            ('comment_2',  'post_1',  'Sofia Alves',    'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=200', 'Discordo! Go tem uma curva de aprendizado menor do que parece e o mercado backend está pedindo muito.', '30 m', 12);

            INSERT OR IGNORE INTO user_communities (user_id, community_id)
            VALUES
            (1, 'dev_pt'), (1, 'tecnologia'), (1, 'filosofia'), (1, 'ia_brasil');

            -- 💡 ADICIONADO: Popula a aba de "Salvos" para o usuário principal (ID 1) nos testes
            INSERT OR IGNORE INTO user_saved_posts (user_id, post_id)
            VALUES 
            (1, 'post_2'),
            (1, 'post_4');
        `);

        console.log("Banco de dados DOXA inicializado perfeitamente com Seeds.");
    } catch (error) {
        console.error("Erro crítico ao inicializar banco:", error);
    }
}