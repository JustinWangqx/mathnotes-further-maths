import { getCollection } from 'astro:content';
import { learnUrl, topics } from '../data/curriculum';
import { searchCatalog } from '../data/search';

export const prerender = true;

export async function GET() {
  const lessons = new Map((await getCollection('learn')).map(lesson => [lesson.data.topicId, lesson]));
  const learningRecords = topics.map(topic => {
    const lesson = lessons.get(topic.id);
    if (!lesson) throw new Error('Missing learning chapter for ' + topic.id);
    const text = (lesson.body ?? '')
      .replace(/^import .*$/gm, '')
      .replace(/\$\$[\s\S]*?\$\$|\$[^$\n]+\$/g, ' ')
      .replace(/<[^>]+>/g, ' ')
      .replace(/\s+/g, ' ').trim();
    return {
      id: 'learn-' + topic.id,
      kind: 'learn',
      module: topic.module,
      topic: topic.id,
      title: topic.title,
      href: learnUrl(topic),
      description: lesson.data.description,
      text,
    };
  });
  return new Response(JSON.stringify({ ...searchCatalog, records: [...learningRecords, ...searchCatalog.records] }), {
    headers: { 'Content-Type': 'application/json; charset=utf-8' },
  });
}
