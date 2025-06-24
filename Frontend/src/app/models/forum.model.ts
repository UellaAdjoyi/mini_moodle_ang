import { Message } from './message.model'; 

export interface Forum {
  _id: string;          
  ue_id: string;        
                        
  nomUE: string;       
  codeUE: string;       
  titre: string;       
  description?: string;  
  messages: Message[];  
  date_creation: string | Date; 
  createdAt?: string | Date;   
  updatedAt?: string | Date;   
}

export { Message };
