export interface FichierAttache {
  path: string;
  nom_original: string;
  type_mime: string;
  taille: number;
}
export interface DevoirRemis {
  _id: string;
  user_id: string;
  email: string;
  fichiers: FichierAttache[];
  date_rendu: string; 
  etat: 'en attente' | 'en retard' | 'rendu' | 'corrigé';
  note: number;
  commentaire_prof: string;
}
export class Devoir {
    devoirs_remis?: DevoirRemis[];
    
}
