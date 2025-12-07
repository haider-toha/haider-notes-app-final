
export interface Note {
  id: string;
  slug: string;
  title: string;
  category: string;
  public: boolean;
  session_id: string;
  created_at: string;
  content: string;
}

export type Theme = 'light' | 'dark';
