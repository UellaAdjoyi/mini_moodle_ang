export interface AuteurMessage {
  user_id: { 
    _id: string;
    nom: string;
    prenom: string;
    photo?: string; 
  } | string; 
  nom?: string;    
  prenom?: string;
  email?: string;  
}

export interface Message {
  _id?: string; 
  auteur: AuteurMessage;
  contenu: string;
  date_heure: string | Date; 
}