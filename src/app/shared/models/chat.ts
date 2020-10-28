import { MessageI } from './message';
export interface ChatI {
    id:string,
    name:string,
    description:string,
    img:string
    message:MessageI[]
}
