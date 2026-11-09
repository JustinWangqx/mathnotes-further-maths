import { getCollection } from 'astro:content';
import { searchCatalog } from '../data/search';

export const prerender = true;

export async function GET() {
  const lessons = new Map((await getCollection('learn')).map(lesson => [lesson.data.topicId, lesson]));
  const records = searchCatalog.records.map(record => {
    if (record.kind !== 'notes') return record;
    const lesson = lessons.get(record.topic);
    if (!lesson) throw new Error('Missing lesson for ' + record.topic);
    const lessonText = (lesson.body ?? '')
      .replace(/^import .*$/gm, '')
      .replace(/\$\$[\s\S]*?\$\$|\$[^$\n]+\$/g, ' ')
      .replace(/<[^>]+>/g, ' ')
      .replace(/\s+/g, ' ').trim();
    return {
      ...record,
      description: lesson.data.description,
      text: record.text + ' ' + lessonText,
    };
  });
  return new Response(JSON.stringify({ ...searchCatalog, records }), {
    headers: { 'Content-Type': 'application/json; charset=utf-8' },
  });
}
