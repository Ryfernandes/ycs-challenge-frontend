export type Challenge = {
  id: number;
  title: string;
  description: string;
  points: number;
  completed_by: string | null;
  updated_at: string;
  color: string;
};

export type Team = {
  id: number;
  name: string;
  points: number;
}