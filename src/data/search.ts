import { topics, topicUrl, url, formulaSheetUrl } from './curriculum';
import { paperCollections, collectionUrl } from './paper-collections';
import { questionTypes } from './question-types';
import originalTypes from './question-types.json';
import paperText from './paper-search.json';
import insightData from './type-insights.json';

const insights: Record<string, Record<string, object>> = insightData;
const original: Record<string, { title: string; method: string; question: string; steps: string[] }[]> = originalTypes;
const texts: Record<string, string> = paperText;
export const searchCatalog = {
  topics: topics.map(t => ({ id: t.id, title: t.title, aliases: t.aliases })),
  records: [
    ...topics.map(t => ({
      id: 'notes-' + t.id, kind: 'notes', module: t.module, topic: t.id, title: t.title, href: topicUrl(t),
      description: t.description, text: t.description,
      sections: questionTypes[t.id].map((q, i) => {
        const en = original[t.id][i];
        return {
          id: q.id, title: '题型 ' + String(i + 1).padStart(2, '0') + ' · ' + q.title,
          href: topicUrl(t) + '#' + q.id, description: t.title + ' · 查看方法、公式和例题。',
          text: [q.title, q.method, q.question, ...q.steps, en.title, en.method, en.question, ...en.steps,
            ...Object.values(insights[t.id][q.id])].join(' '),
        };
      }),
    })),
    ...paperCollections.map(p => ({
      id: p.id, kind: 'papers', module: p.module, topic: p.topic, title: p.title, href: collectionUrl(p), answers: !!p.answers,
      description: p.questionCount + ' 道完整历年试题 · 原件 ' + p.questions.pages + ' 页' + (p.answers ? ' · 附答案' : '') + '。',
      text: [p.questions.source, p.answers?.source || '', texts[p.id]].join(' '),
    })),
    { id: 'mf19', kind: 'resources', module: '', topic: '', title: 'MF19 公式表与 statistical tables', href: formulaSheetUrl,
      description: 'Cambridge 官方 PDF，适用于 A Level Mathematics (9709) 和 Further Mathematics (9231)。',
      text: 'MF19 formula booklet list of formulae statistical tables 9709 9231 数学 公式表 公式 统计表' },
    { id: 'syllabus', kind: 'resources', module: '', topic: '', title: 'Cambridge 考纲与参考资料', href: url('resources/'),
      description: 'CIE Further Mathematics 9231 官方考纲（2026–2027）及学习资料。', text: 'syllabus specification curriculum 2026 2027 考纲 大纲' },
  ],
};
