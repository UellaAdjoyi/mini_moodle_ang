import { Devoir } from "./devoir";
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
export class Post {
    _id: any;
    type_post : any;
    titre: any;
    libelle: any;
    date_heure_publication: any;
    codeUE?: any;
    id_prof: any;
    date_limite?: any;
    fichiers_attaches?: FichierAttache[];
    devoirs_remis?: DevoirRemis[];
}
