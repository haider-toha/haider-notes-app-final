export interface Note {
  id: string;
  slug: string;
  title: string;
  category: string;
  folder?: string; // Folder this note belongs to
  public: boolean;
  session_id: string;
  created_at: string;
  content: string;
}

export interface Folder {
  id: string;
  name: string;
  icon?:
    | "folder"
    | "cloud"
    | "notes"
    | "imported"
    | "blog"
    | "bookmarks"
    | "reflections";
  isExpanded?: boolean;
}

export type Theme = "light" | "dark";
