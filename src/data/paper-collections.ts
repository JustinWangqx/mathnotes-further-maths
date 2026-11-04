import records from './paper-collections.json';
import {url} from './curriculum';
export type PaperAsset = {file:string;source:string;pages:number;bytes:number;sha256:string};
export type PaperCollection = {id:string;topic:string;module:string;title:string;questionCount:number;questions:PaperAsset;answers:PaperAsset|null;previews:{file:string;width:number;height:number;page:number}[]};
export const paperCollections = records as PaperCollection[];
export const papersForTopic = (topic:string) => paperCollections.filter(p=>p.topic===topic);
export const collectionUrl = (paper:PaperCollection) => url(`papers/${paper.id}/`);
export const totalPaperQuestions = paperCollections.reduce((sum,p)=>sum+p.questionCount,0);
