import { type SQLiteDatabase } from 'expo-sqlite';

export async function initializeDatabase(database: SQLiteDatabase) {
  try {
    // Ativa suporte a chaves estrangeiras e modo de escrita otimizado
    await database.execAsync(`
      PRAGMA journal_mode = WAL;
      PRAGMA foreign_keys = ON;
    `);

    await database.execAsync(`
      /* Tabela de Usuário (Perfil) */
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

      /* Tabela de Comunidades */
      CREATE TABLE IF NOT EXISTS communities (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        members TEXT DEFAULT '0',
        description TEXT,
        is_joined INTEGER DEFAULT 0 /* 1 se o usuário participa */
      );

      /* Tabela de Posts */
      CREATE TABLE IF NOT EXISTS posts (
        id TEXT PRIMARY KEY,
        user_id INTEGER,
        author TEXT NOT NULL,
        title TEXT NOT NULL,
        description TEXT NOT NULL,
        image_url TEXT,
        upvotes INTEGER DEFAULT 0,
        comments_count INTEGER DEFAULT 0,
        is_saved INTEGER DEFAULT 0, /* Filtro para a aba Salvos */
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
      );

      /* Inserção do Usuário Inicial (Seed) */
      INSERT OR IGNORE INTO users (id, name, handle, bio, avatarUrl, bannerUrl, followers, following) 
      VALUES (1, 'João Victor', '@joaov', 'Desenvolvedor Full Stack apaixonado por tecnologia. Criando a rede DOXA 🚀', 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=800&auto=format&fit=crop', 'https://images.unsplash.com/photo-1604871000636-074fa5117945?q=80&w=2000&auto=format&fit=crop', 1240, 342);
      
      /* Inserção de Comunidades de Exemplo (Seed) */
      INSERT OR IGNORE INTO communities (id, name, members, description, is_joined)
      VALUES 
      ('dev_pt', 'd://dev_pt', '15k', 'Comunidade para desenvolvedores que falam português.', 1),
      ('tecnologia', 'd://tecnologia', '250k', 'Discussões sobre o mundo da tecnologia.', 1);
    `);

    console.log("Banco de dados DOXA inicializado.");
  } catch (error) {
    console.error("Erro ao inicializar banco:", error);
  }
}