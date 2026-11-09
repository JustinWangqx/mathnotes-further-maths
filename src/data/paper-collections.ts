import records from './paper-collections.json';
import {url} from './curriculum';
export type PaperAsset = {file:string;source:string;pages:number;bytes:number;sha256:string};
export type PaperCollection = {id:string;topic:string;module:string;title:string;questionCount:number;questions:PaperAsset;answers:PaperAsset|null;previews:{file:string;width:number;height:number;page:number}[]};
export const paperCollections: PaperCollection[] = records.map(paper => ({
  ...paper,
  title: paper.title.replace('Topic questions', '专题试题')
    .replace('Additional questions', '补充试题').replace('Homework', '作业')
    .replace(/Collection (\d+)/, '试题 $1'),
}));
export const papersForTopic = (topic:string) => paperCollections.filter(p=>p.topic===topic);
export const collectionUrl = (paper:PaperCollection) => url(`papers/${paper.id}/`);
export const totalPaperQuestions = paperCollections.reduce((sum,p)=>sum+p.questionCount,0);
