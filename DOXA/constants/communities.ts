export interface Community {
  id: string;
  name: string;
  members: string;
  imageUrl: string;
  description: string;
}

export const MOCK_COMMUNITIES: Community[] = [
  {
    id: "dev_pt",
    name: "d://dev_pt",
    members: "15k",
    imageUrl: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=800&auto=format&fit=crop",
    description: "Comunidade para desenvolvedores que falam português.",
  },
  {
    id: "tecnologia",
    name: "d://tecnologia",
    members: "250k",
    imageUrl: "https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=800&auto=format&fit=crop",
    description: "Notícias e discussões sobre o mundo da tecnologia.",
  },
  {
    id: "gaming",
    name: "d://gaming",
    members: "1.2m",
    imageUrl: "https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=800&auto=format&fit=crop",
    description: "O maior fórum de jogos da rede DOXA.",
  },
  {
    id: "meuSetup",
    name: "d://meuSetup",
    members: "89k",
    imageUrl: "https://images.unsplash.com/photo-1499951360447-b19be8fe80f5?q=80&w=800&auto=format&fit=crop",
    description: "Compartilhe e avalie setups de outras pessoas.",
  },
  {
    id: "filosofia",
    name: "d://filosofia",
    members: "45k",
    imageUrl: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?q=80&w=800&auto=format&fit=crop",
    description: "Discussões sobre grandes pensadores e correntes filosóficas.",
  },
  {
    id: "musica",
    name: "d://musica",
    members: "320k",
    imageUrl: "https://images.unsplash.com/photo-1511379938547-c1f69419868d?q=80&w=800&auto=format&fit=crop",
    description: "Tudo sobre o mundo da música, de teoria a lançamentos.",
  },
  {
    id: "ciencia",
    name: "d://ciencia",
    members: "180k",
    imageUrl: "https://images.unsplash.com/photo-1507413245164-6160d8298b31?q=80&w=800&auto=format&fit=crop",
    description: "Explorações científicas e descobertas do universo.",
  },
];
