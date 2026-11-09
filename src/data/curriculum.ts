export const modules = [
  { id: 'fp1', short: 'FP1', title: 'Further Pure 1', paper: 'Paper 1', description: '从多项式、曲线、矩阵和向量入手。', color: 'sage', icon: 'function' },
  { id: 'fp2', short: 'FP2', title: 'Further Pure 2', paper: 'Paper 2', description: '学习更深入的微积分方法，并用 complex numbers 描述平面上的运算。', color: 'peach', icon: 'integral' },
  { id: 'mechanics', short: 'FM', title: 'Further Mechanics', paper: 'Paper 3', description: '用 moments、centre of mass 和 force diagram 分析 rigid-body equilibrium。', color: 'sand', icon: 'orbit' },
  { id: 'statistics', short: 'FS', title: 'Further Statistics', paper: 'Paper 4', description: '把概率分布与统计检验联系起来。', color: 'lavender', icon: 'chart' },
] as const;
export type ModuleId = typeof modules[number]['id'];
export type Topic = { id: string; module: ModuleId; title: string; ref: string; aliases: string[]; description: string; minutes?: number; slug?: string; sourceAvailable: boolean };
export const topics: Topic[] = [
  { id:'roots', module:'fp1', title:'Roots of polynomial equations', ref:'1.1', aliases:['多项式','多项式的根','韦达定理','polynomial roots','polynomials','roots','Vieta'], description: '用根与系数的关系推导 power sums 和根的变换。', minutes:12, slug:'roots-of-polynomials', sourceAvailable:true },
  { id:'rational', module:'fp1', title:'Rational functions and graphs', ref:'1.2', aliases:['有理函数','渐近线','asymptotes'], description: '通过 asymptotes、range 和图像变换画出曲线。', minutes:11, slug:'rational-functions', sourceAvailable:true },
  { id:'series', module:'fp1', title:'Summation of series', ref:'1.3', aliases:['数列','级数','求和','method of differences'], description: '推导求和公式并使用 method of differences。', minutes:10, slug:'summation-of-series', sourceAvailable:true },
  { id:'matrices1', module:'fp1', title:'Matrices', ref:'1.4', aliases:['矩阵','matrix','determinants'], description: '求 inverse，并用矩阵描述平面 transformation。', minutes:12, slug:'matrices', sourceAvailable:true },
  { id:'vectors', module:'fp1', title:'Vectors', ref:'1.6', aliases:['向量','直线','平面','cross product'], description: '研究三维空间的直线、平面、角度和距离。', minutes:13, slug:'vectors', sourceAvailable:true },
  { id:'hyperbolic', module:'fp2', title:'Hyperbolic functions', ref:'2.1', aliases:['双曲函数','sinh','cosh','tanh'], description: '从指数定义出发，推导恒等式和 inverse functions。', minutes:11, slug:'hyperbolic-functions', sourceAvailable:true },
  { id:'differentiation', module:'fp2', title:'Differentiation', ref:'2.3', aliases:['微分','求导','Maclaurin','derivatives'], description: '理解 implicit differentiation、parametric derivatives 和 Maclaurin series。', minutes:13, slug:'differentiation', sourceAvailable:true },
  { id:'integration', module:'fp2', title:'Integration', ref:'2.4', aliases:['积分','定积分','reduction formula'], description: '选择合适的 substitution 并推导 reduction formula。', minutes:14, slug:'integration', sourceAvailable:true },
  { id:'complex', module:'fp2', title:'Complex numbers', ref:'2.5', aliases:['复数','复平面','complex','de Moivre','roots of unity','Argand'], description: '在 Cartesian form 和 polar form 间转换，求幂和根。', minutes:14, slug:'complex-numbers', sourceAvailable:true },
  { id:'equilibrium', module:'mechanics', title:'Equilibrium of a rigid body', ref:'3.2', aliases:['刚体平衡','重心','质心','力矩','摩擦','倾倒','equilibrium','rigid body','centre of mass','center of mass'], description: '求 centre of mass，分析 moments、friction、suspension 和 toppling。', minutes:18, slug:'equilibrium-of-a-rigid-body', sourceAvailable:true },
  { id:'pdf-cdf', module:'statistics', title:'Probability density & distribution', ref:'4.1', aliases:['概率密度','分布函数','连续随机变量','PDF','CDF','continuous random variables'], description: '将概率看成面积，由 PDF 得到 CDF，并求 moments。', minutes:13, slug:'pdf-and-cdf', sourceAvailable:true },
  { id:'inference', module:'statistics', title:'Statistical inference', ref:'4.2', aliases:['统计推断','置信区间','t test','normal distribution'], description: '用 normal distribution 和 t distribution 作统计推断。', minutes:14, slug:'statistical-inference', sourceAvailable:true },
  { id:'chi-squared', module:'statistics', title:'Chi-squared tests', ref:'4.3', aliases:['卡方检验','χ²','chi square'], description: '检验 goodness of fit 和 independence。', minutes:12, slug:'chi-squared-tests', sourceAvailable:true },
  { id:'non-parametric', module:'statistics', title:'Non-parametric tests', ref:'4.4', aliases:['非参数检验','符号检验','Wilcoxon','sign test'], description: '用符号和 ranks 检验 median 或配对变化。', minutes:14, slug:'non-parametric-tests', sourceAvailable:true },
  { id:'pgf', module:'statistics', title:'Probability generating functions', ref:'4.5', aliases:['概率生成函数','PGF'], description: '用 PGF 表示离散分布并求 moments。', minutes:12, slug:'probability-generating-functions', sourceAvailable:true },
];
export const availableTopics = topics.filter(t => t.slug);
export const moduleFor = (id: string) => modules.find(m => m.id === id)!;
export const url = (path = '') => `${import.meta.env.BASE_URL}${path.replace(/^\//, '')}`;
export const topicUrl = (topic: Topic) => topic.slug ? url(`9231/${topic.module}/${topic.slug}/`) : url(`notes/#${topic.id}`);
export const syllabusUrl = 'https://www.cambridgeinternational.org/Images/697357-2026-2027-syllabus.pdf';
export const repoUrl = 'https://github.com/JustinWangqx/mathnotes-further-maths';

export const formulaSheetUrl = 'https://www.cambridgeinternational.org/Images/417318-list-of-formulae-and-statistical-tables.pdf';
