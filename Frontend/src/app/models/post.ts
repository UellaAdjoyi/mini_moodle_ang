import { Devoir } from "./devoir";
export class Post {
    id_post: any;
    type : any;
    titre: any;
    libelle: any;
    date_heure: any;
    codeUe?: any;
    id_prof: any;
    date_limite?: any;
    fichier?: string[];
    devoirs?: Devoir[];

    
    // cours?: Ue[];
}
