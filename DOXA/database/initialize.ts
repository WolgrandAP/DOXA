import { type SQLiteDatabase } from "expo-sqlite";

export async function initializeDatabase(database: SQLiteDatabase) {
  try {
    await database.execAsync(`
      PRAGMA journal_mode = WAL;
      PRAGMA foreign_keys = ON;
    `);

    await database.execAsync(`
      CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        handle TEXT NOT NULL UNIQUE,
        bio TEXT,
        avatarUrl TEXT,
        bannerUrl TEXT,
        followers INTEGER DEFAULT 0,
        following INTEGER DEFAULT 0
      );

      CREATE TABLE IF NOT EXISTS communities (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL UNIQUE,
        members TEXT DEFAULT '0',
        description TEXT,
        is_joined INTEGER DEFAULT 0,
        creator_id INTEGER,
        banner_url TEXT
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
        FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
      );

      CREATE TABLE IF NOT EXISTS comments (
        id TEXT PRIMARY KEY,
        post_id TEXT NOT NULL,
        author TEXT NOT NULL,
        avatar TEXT,
        text TEXT NOT NULL,
        time TEXT,
        likes INTEGER DEFAULT 0,
        isLiked INTEGER DEFAULT 0,
        replies TEXT DEFAULT '[]',
        FOREIGN KEY (post_id) REFERENCES posts (id) ON DELETE CASCADE
      );
    `);

    try {
      await database.execAsync(`ALTER TABLE communities ADD COLUMN creator_id INTEGER;`);
    } catch (_) {}

    try {
      await database.execAsync(`ALTER TABLE communities ADD COLUMN banner_url TEXT;`);
    } catch (_) {}

    try {
      await database.execAsync(`ALTER TABLE communities ADD COLUMN name TEXT NOT NULL DEFAULT '';`);
    } catch (_) {}

    // Seed user
    await database.execAsync(`
      INSERT OR IGNORE INTO users (id, name, handle, bio, avatarUrl, bannerUrl, followers, following)
      VALUES 
        (1, 'João Victor', '@joaov',
        'Desenvolvedor Full Stack apaixonado por tecnologia. Criando a rede DOXA 🚀',
        'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=800&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1604871000636-074fa5117945?q=80&w=2000&auto=format&fit=crop',
        1240, 342),
        (2, 'Outros Autores', '@outros',
        'Usuário genérico para outros autores',
        'https://ui-avatars.com/api/?name=Outros&background=random',
        'https://images.unsplash.com/photo-1604871000636-074fa5117945?q=80&w=2000&auto=format&fit=crop',
        0, 0);
    `);

    // Seed communities
    await database.execAsync(`
      INSERT OR IGNORE INTO communities (id, name, members, description, is_joined, creator_id)
      VALUES
        ('dev_pt',        'd://dev_pt',        '15.2k',  'Comunidade para desenvolvedores que falam português. Compartilhe código, dúvidas e conquistas.', 1, 2),
        ('tecnologia',    'd://tecnologia',    '248k',   'Discussões sobre o mundo da tecnologia: gadgets, tendências, inovações e futuro digital.', 1, 2),
        ('filosofia',     'd://filosofia',     '32.7k',  'Explore grandes questões da existência humana. Debates sobre ética, metafísica e epistemologia.', 1, 2),
        ('politica_br',   'd://politica_br',   '89.1k',  'Debate político brasileiro com respeito e argumentos. Fuja do extremismo, entre na conversa.', 0, 2),
        ('ciencia',       'd://ciencia',       '113k',   'Divulgação científica, papers recentes, descobertas e discussões sobre o método científico.', 0, 2),
        ('ia_brasil',     'd://ia_brasil',     '41.5k',  'Inteligência Artificial em português: LLMs, agentes, ética em IA, tutoriais e novidades do setor.', 1, 2),
        ('psicologia',    'd://psicologia',    '27.3k',  'Saúde mental, comportamento humano, teorias psicológicas e recursos de autoconhecimento.', 0, 2),
        ('astronomia',    'd://astronomia',    '56.8k',  'O universo nos fascina. Exoplanetas, buracos negros, missões espaciais e astrofísica para todos.', 0, 2),
        ('economia',      'd://economia',      '73.4k',  'Macroeconomia, finanças pessoais, mercado financeiro, criptos e análise econômica brasileira.', 0, 2),
        ('historia',      'd://historia',      '18.9k',  'Da antiguidade ao contemporâneo. Análise histórica, revisionismo e aprendizados do passado.', 0, 2),
        ('literatura',    'd://literatura',    '22.1k',  'Recomendações, análises e debates sobre livros, autores e movimentos literários nacionais e mundiais.', 0, 2),
        ('jogos',         'd://jogos',         '195k',   'Games, esports, retrogaming, reviews e tudo que o mundo dos jogos eletrônicos tem a oferecer.', 0, 2);
    `);

    // Seed posts
    await database.execAsync(`
      INSERT OR IGNORE INTO posts (id, user_id, author, title, description, subject, tag, role, time, upvotes, comments_count)
      VALUES
        ('post_1',  1, 'João Victor',    'Qual a melhor linguagem para iniciantes em 2026?',           'Estou em dúvida entre Python e Go. O que o mercado está pedindo mais atualmente para vagas Junior? Tenho 6 meses de estudo e quero focar em backend.',                                              'd://dev_pt',      '#discussão',    'Desenvolvedor',          '1 h',    42,  15),
        ('post_2',  1, 'João Victor',    'Novo processador quântico atinge estabilidade comercial',    'A IBM anunciou ontem um processador quântico de 1000 qubits com taxa de erro abaixo de 0.1%. Isso pode mudar completamente a forma como lidamos com criptografia na web.',                       'd://tecnologia',  '#news',         'Desenvolvedor',          '5 h',   890, 142),
        ('post_3',  2, 'Mariana Costa',  'O livre arbítrio existe ou é uma ilusão?',                  'Após ler "Free Will" do Sam Harris, fiquei com a sensação de que toda escolha é apenas o resultado de processos físicos anteriores. Como vocês reconciliam isso com a responsabilidade moral?',   'd://filosofia',   '#debate',       'Filósofa',               '2 h',   234,  67),
        ('post_4',  2, 'Rafael Mendes',  'Claude 4 vs GPT-5: qual está ganhando na prática?',         'Testei os dois por 3 semanas em tarefas reais de desenvolvimento. Claude 4 se sai melhor em raciocínio de código, GPT-5 domina criatividade textual. Detalhes no comentário.',                  'd://ia_brasil',   '#review',       'Engenheiro de ML',       '30 m',  567,  89),
        ('post_5',  2, 'Fernanda Lima',  'STF e a democracia: onde está o equilíbrio?',               'Independente de posição política, precisamos discutir os limites institucionais do poder judiciário num regime democrático. O ativismo judicial é um risco ou uma necessidade?',                  'd://politica_br', '#debate',       'Jurista',                '4 h',   412,  201),
        ('post_6',  2, 'Carlos Neto',    'JWST captura imagem de galaxia a 13 bi de anos-luz',        'O Telescópio James Webb mais uma vez nos presenteia com uma imagem impossível. A galáxia GN-z11 foi fotografada com detalhes sem precedentes. O que isso nos diz sobre a formação do universo?',  'd://astronomia',  '#descoberta',   'Astrofísico',            '7 h',  1203, 178),
        ('post_7',  2, 'Ana Beatriz',    'Síndrome do impostor: você sofre com isso?',                'Tenho 4 anos de experiência como dev, trabalho numa empresa top, e ainda sinto que não sou bom o suficiente. Alguém mais passa por isso? Como vocês lidam?',                                     'd://psicologia',  '#experiência',  'Psicóloga',              '3 h',   678,  134),
        ('post_8',  2, 'Lucas Ferreira', 'Bitcoin a R$ 600k: bolha ou nova realidade?',               'Com a aprovação dos ETFs de Bitcoin e a entrada de capital institucional, estamos vendo uma mudança de paradigma ou repetindo o ciclo de 2021? Análise técnica e fundamental no post.',            'd://economia',    '#análise',      'Analista Financeiro',    '6 h',   345,  92),
        ('post_9',  2, 'Sofia Alves',    'Os romances de Clarice Lispector sob nova ótica',           'Reli "A Paixão Segundo G.H." após anos e percebi camadas que não havia notado. A obra de Clarice vai além do existencialismo — é uma fenomenologia do corpo e do nojo. Discussão aberta.',        'd://literatura',  '#análise',      'Professora de Letras',   '1 h',   189,  45),
        ('post_10', 2, 'Pedro Oliveira', 'GTA VI vale o hype? Primeiras impressões',                  'Depois de 12 horas de gameplay posso dizer: Rockstar entregou. A Lucia é um dos personagens mais bem escritos da saga. O mapa de Vice City é absurdamente detalhado. Review completo abaixo.',    'd://jogos',       '#review',       'Game Designer',          '8 h',  2341, 456),
        ('post_11', 2, 'Thiago Santos',  'A queda do Império Romano e lições para hoje',              'Historiadores debatem há séculos o porquê da queda. Mas o que mais me chama atenção são as semelhanças com dinâmicas políticas contemporâneas: polarização, debilitação das instituições, inflação.', 'd://historia',   '#debate',       'Historiador',            '2 h',   267,  83),
        ('post_12', 1, 'João Victor',    'TypeScript 6.0 chegou e está incrível',                     'A nova versão traz inferência de tipos muito mais poderosa, decorators nativos e integração direta com o Wasm GC. Fiz um tutorial rápido do que muda no dia a dia. Link nos comentários.',          'd://dev_pt',      '#tutorial',     'Desenvolvedor',          '45 m',  321,  56),
        ('post_13', 2, 'Camila Rocha',   'Placebo ou eficácia real? O debate sobre homeopatia',       'Estudos de duplo-cego consistentemente mostram ausência de efeito acima do placebo. Como uma nação ainda subsidia isso no SUS? Vamos falar sobre pensamento científico e políticas de saúde.',    'd://ciencia',     '#debate',       'Pesquisadora',           '5 h',   789, 167),
        ('post_14', 2, 'Daniel Braga',   'Agentes de IA vão substituir desenvolvedores?',             'Não. E vou explicar por quê. Trabalhei 6 meses com equipes usando Devin, GitHub Copilot e Claude. A produtividade subiu, mas o papel do dev mudou — não sumiu. O que muda é o que você entrega.',  'd://ia_brasil',   '#opinião',      'CTO',                    '3 h',   934, 213),
        ('post_15', 2, 'Mariana Costa',  'Nietzsche tinha razão sobre a moral cristã?',               '"Além do Bem e do Mal" é uma crítica poderosa às bases morais ocidentais. Concordo que a moral do ressentimento é real — mas Nietzsche oferece alguma alternativa construtiva? Debata.',             'd://filosofia',   '#debate',       'Filósofa',               '9 h',   445,  98),
        ('post_16', 2, 'Rafael Mendes',  'React Native vs Flutter em 2026: qual escolher?',           'Depois de projetos reais nos dois, minha conclusão: Flutter para apps com UI pesada e performance crítica, RN para times que já dominam React/TS e precisam de integração nativa rápida.',           'd://dev_pt',      '#discussão',    'Engenheiro Mobile',      '1 h',   234,  67),
        ('post_17', 2, 'Lucas Ferreira', 'Renda básica universal: utopia ou solução real?',           'Com a automação eliminando empregos e o custo do bem-estar social crescendo, países como Finlândia e Quênia testaram a RBU. Os dados são mais positivos do que a narrativa popular sugere.',         'd://economia',    '#análise',      'Economista',             '12 h',  567, 134),
        ('post_18', 2, 'Carlos Neto',    'Vida em Marte: cada vez mais próxima?',                     'A descoberta de metano sazonal em Marte aliada aos dados de percloratos no solo cria um cenário fascinante. A vida marciana pode existir em forma extremofílica abaixo da superfície.',             'd://astronomia',  '#descoberta',   'Astrofísico',            '6 h',   876, 145),
        ('post_19', 2, 'Pedro Oliveira', 'Hollow Knight: Silksong vai sair algum dia?',               'Estamos na 8ª geração de consoles e o jogo ainda não saiu. Enquanto isso, o primeiro Hollow Knight continua sendo uma obra-prima do metroidvania. Quais são as expectativas de vocês?',             'd://jogos',       '#discussão',    'Game Designer',          '20 m', 1567, 334),
        ('post_20', 2, 'Ana Beatriz',    'Terapia cognitivo-comportamental vs psicanálise',           'Como psicóloga que pratica TCC há 8 anos, defendo a eficácia baseada em evidências. Mas vejo valor clínico na psicanálise para estruturas mais profundas de personalidade. O debate importa.',     'd://psicologia',  '#debate',       'Psicóloga',              '4 h',   432,  89),
        ('post_21', 1, 'João Victor',    'Dica de produtividade: O Método Pomodoro reverso',          'Ao invés de focar no tempo de trabalho, foque no tempo de descanso. Eu programo meu timer para me forçar a parar a cada 45 minutos. Minha energia no fim do dia dobrou. Quem mais faz algo parecido?', 'd://dev_pt', '#dica', 'Desenvolvedor', '2 h', 120, 24),
        ('post_22', 1, 'João Victor',    'Qual a melhor arquitetura para React em larga escala?',     'Estou começando um projeto que vai escalar bastante. Clean Architecture, FSD (Feature-Sliced Design) ou ir pelo básico de módulos? O que vocês preferem para manter a manutenção saudável?', 'd://dev_pt', '#arquitetura', 'Desenvolvedor', '10 h', 310, 89),
        ('post_23', 1, 'João Victor',    'O futuro dos agentes autônomos na programação',             'Eu venho testando algumas ferramentas e acredito que a interface baseada em chat vai sumir em 2 anos. Agentes invisíveis integrados no pipeline CI/CD serão o padrão. Concordam?', 'd://ia_brasil', '#futuro', 'Desenvolvedor', '1 d', 452, 112),
        ('post_24', 1, 'João Victor',    'Como lidar com o burnout na área de tecnologia?',           'Senti que estava no limite semana passada e precisei me afastar das telas por 3 dias inteiros. A cultura de "hustle" está nos destruindo aos poucos. Quais são as estratégias de vocês para desligar de verdade?', 'd://psicologia', '#desabafo', 'Desenvolvedor', '3 d', 890, 230),
        ('post_25', 1, 'João Victor',    'Setup minimalista 2026: Menos é mais',                      'Acabei de vender meu segundo monitor e troquei o teclado mecânico gigantesco por um 60%. Trabalhar com menos distrações físicas na mesa melhorou muito meu foco profundo.', 'd://tecnologia', '#setup', 'Desenvolvedor', '5 d', 560, 45);
    `);

    // Atualiza posts existentes para garantir que o user_id esteja correto
    await database.execAsync(`
      UPDATE posts 
      SET user_id = 2 
      WHERE id IN (
        'post_3', 'post_4', 'post_5', 'post_6', 'post_7', 'post_8', 
        'post_9', 'post_10', 'post_11', 'post_13', 'post_14', 'post_15', 
        'post_16', 'post_17', 'post_18', 'post_19', 'post_20'
      );
    `);

    // Seed comments
    await database.execAsync(`
      INSERT OR IGNORE INTO comments (id, post_id, author, avatar, text, time, likes)
      VALUES
        ('comment_1',  'post_1',  'Carlos Neto',    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200', 'Python definitivamente para iniciantes. A sintaxe limpa ajuda a focar na lógica sem se preocupar com tipos.', '45 m', 18),
        ('comment_2',  'post_1',  'Sofia Alves',    'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=200', 'Discordo! Go tem uma curva de aprendizado menor do que parece e o mercado backend está pedindo muito.', '30 m', 12),
        ('comment_3',  'post_2',  'Daniel Braga',   'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=200', 'O impacto na criptografia é o ponto mais crítico. RSA de 2048 bits seria vulnerável com este hardware.', '4 h',  67),
        ('comment_4',  'post_3',  'Thiago Santos',  'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=200', 'Harris simplifica demais. Compatibilismo resolve o problema sem negar o livre arbítrio nem a causalidade.', '1 h',  34),
        ('comment_5',  'post_4',  'Camila Rocha',   'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=200', 'Claude 4 ganhou muito no reasoning. Mas GPT-5 ainda domina em tasks multimodais complexas.', '20 m', 45),
        ('comment_6',  'post_7',  'João Victor',    'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=200', 'Sofro muito com isso. O que ajudou foi documentar minhas conquistas semanalmente e revisar quando a síndrome aparece.', '2 h',  89),
        ('comment_7',  'post_10', 'Ana Beatriz',    'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=200', 'Finalmente! Esperei 10 anos por esse jogo. A Lucia realmente é icônica, e o mapa parece vivo.', '7 h',  234),
        ('comment_8',  'post_14', 'Rafael Mendes',  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200', 'Concordo 100%. O dev vira mais um arquiteto de soluções. Quem não se adaptar vai ter problemas sim.', '2 h', 156);
    `);

    console.log("Banco de dados DOXA inicializado.");
  } catch (error) {
    console.error("Erro ao inicializar banco:", error);
  }
}