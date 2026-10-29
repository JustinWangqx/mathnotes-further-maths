export const modules = [
  { id: 'fp1', short: 'FP1', title: 'Further Pure 1', paper: 'Paper 1', description: 'Find the patterns behind polynomials, curves, matrices and vectors.', color: 'sage', icon: 'function' },
  { id: 'fp2', short: 'FP2', title: 'Further Pure 2', paper: 'Paper 2', description: 'Take calculus further and explore the language of complex numbers.', color: 'peach', icon: 'integral' },
  { id: 'statistics', short: 'FS', title: 'Further Statistics', paper: 'Paper 4', description: 'Connect probability, distributions and the evidence behind a test.', color: 'lavender', icon: 'chart' },
] as const;
export type ModuleId = typeof modules[number]['id'];
export type Topic = { id: string; module: ModuleId; title: string; ref: string; aliases: string[]; description: string; minutes?: number; slug?: string; sourceAvailable: boolean };
export const topics: Topic[] = [
  { id:'roots', module:'fp1', title:'Roots of polynomial equations', ref:'1.1', aliases:['多项式','多项式的根','韦达定理','polynomial roots','Vieta'], description:'Connect roots and coefficients, then transform an equation without solving it.', minutes:12, slug:'roots-of-polynomials', sourceAvailable:true },
  { id:'rational', module:'fp1', title:'Rational functions and graphs', ref:'1.2', aliases:['有理函数','渐近线','asymptotes'], description:'Understand asymptotes, ranges and graph transformations.', minutes:11, slug:'rational-functions', sourceAvailable:true },
  { id:'series', module:'fp1', title:'Summation of series', ref:'1.3', aliases:['数列','级数','求和','method of differences'], description:'Use standard sums and the method of differences.', minutes:10, slug:'summation-of-series', sourceAvailable:true },
  { id:'matrices1', module:'fp1', title:'Matrices', ref:'1.4', aliases:['矩阵','matrix','determinants'], description:'Work with matrices, inverses and linear transformations.', minutes:12, slug:'matrices', sourceAvailable:true },
  { id:'vectors', module:'fp1', title:'Vectors', ref:'1.6', aliases:['向量','直线','平面','cross product'], description:'Explore lines, planes, angles and distances in three dimensions.', minutes:13, slug:'vectors', sourceAvailable:true },
  { id:'hyperbolic', module:'fp2', title:'Hyperbolic functions', ref:'2.1', aliases:['双曲函数','sinh','cosh','tanh'], description:'Meet exponential definitions, identities and inverse functions.', minutes:11, slug:'hyperbolic-functions', sourceAvailable:true },
  { id:'differentiation', module:'fp2', title:'Differentiation', ref:'2.3', aliases:['微分','求导','Maclaurin','derivatives'], description:'Develop derivatives, series and arc-length methods.', minutes:13, slug:'differentiation', sourceAvailable:true },
  { id:'integration', module:'fp2', title:'Integration', ref:'2.4', aliases:['积分','定积分','reduction formula'], description:'Choose substitutions and derive reduction formulae.', minutes:14, slug:'integration', sourceAvailable:true },
  { id:'complex', module:'fp2', title:'Complex numbers', ref:'2.5', aliases:['复数','复平面','de Moivre','roots of unity','Argand'], description:'Move between Cartesian and polar forms, powers and roots.', minutes:14, slug:'complex-numbers', sourceAvailable:true },
  { id:'pdf-cdf', module:'statistics', title:'Probability density & distribution', ref:'4.1', aliases:['概率密度','分布函数','连续随机变量','PDF','CDF','continuous random variables'], description:'Read probability as area, build a CDF and find moments.', minutes:13, slug:'pdf-and-cdf', sourceAvailable:true },
  { id:'inference', module:'statistics', title:'Statistical inference', ref:'4.2', aliases:['统计推断','置信区间','t test','normal distribution'], description:'Use normal and t-distributions for inference.', minutes:14, slug:'statistical-inference', sourceAvailable:true },
  { id:'chi-squared', module:'statistics', title:'Chi-squared tests', ref:'4.3', aliases:['卡方检验','χ²','chi square'], description:'Test goodness of fit and independence.', minutes:12, slug:'chi-squared-tests', sourceAvailable:true },
  { id:'non-parametric', module:'statistics', title:'Non-parametric tests', ref:'4.4', aliases:['非参数检验','符号检验','Wilcoxon','sign test'], description:'Use signs and ranks when a parametric model is unsuitable.', minutes:14, slug:'non-parametric-tests', sourceAvailable:true },
  { id:'pgf', module:'statistics', title:'Probability generating functions', ref:'4.5', aliases:['概率生成函数','PGF'], description:'Represent discrete distributions and recover their moments.', minutes:12, slug:'probability-generating-functions', sourceAvailable:true },
];
export const availableTopics = topics.filter(t => t.slug);
export const moduleFor = (id: string) => modules.find(m => m.id === id)!;
export const url = (path = '') => `${import.meta.env.BASE_URL}${path.replace(/^\//, '')}`;
export const topicUrl = (topic: Topic) => topic.slug ? url(`9231/${topic.module}/${topic.slug}/`) : url(`syllabus/#${topic.id}`);
export const syllabusUrl = 'https://www.cambridgeinternational.org/Images/697357-2026-2027-syllabus.pdf';
export const papersUrl = 'https://www.cambridgeinternational.org/programmes-and-qualifications/cambridge-international-as-and-a-level-mathematics-further-9231/past-papers/';
export const repoUrl = 'https://github.com/JustinWangqx/mathnotes-further-maths';
