// Break working at top-level relations only. Groups, matrices, cases and
// author-supplied aligned environments retain their mathematical structure.
export function layoutMath(tex) {
  tex = tex.trim();
  if (/\\begin\{(?:aligned|align|gathered|split)\}/.test(tex)) return tex;
  let braces = 0, brackets = 0, environment = 0;
  const separators = [], relations = [];
  for (let i = 0; i < tex.length; i++) {
    const rest = tex.slice(i);
    const env = rest.match(/^\\(begin|end)\{[^}]+\}/);
    if (env) { environment += env[1] === 'begin' ? 1 : -1; i += env[0].length - 1; continue; }
    const c = tex[i];
    if (c === '{' && tex[i-1] !== '\\') braces++;
    if (c === '}' && tex[i-1] !== '\\') braces--;
    if ('(['.includes(c) && tex[i-1] !== '\\') brackets++;
    if (')]'.includes(c) && tex[i-1] !== '\\') brackets--;
    if (braces || brackets || environment) continue;
    if ((c === ',' || c === ';') && tex[i-1] === '\\') continue;
    const sep = rest.match(/^(?:;\s*(?:\\q(?:quad|uad))?|,\s*\\q(?:quad|uad)|\\qquad)/);
    if (sep) { separators.push([i, sep[0].length]); i += sep[0].length - 1; continue; }
    if (c === ',' && /^[^,;]*=/.test(rest.slice(1))) { separators.push([i, 1]); continue; }
    if (c === ':' && tex.slice(0,i).includes('=') && /^[^;]*=/.test(rest.slice(1))) { separators.push([i, 1]); continue; }
    const relation = rest.match(/^(?:=|\\approx(?![a-zA-Z]))/);
    if (relation) { relations.push([i, relation[0].length]); i += relation[0].length - 1; }
  }
  if (separators.length) {
    const rows = []; let start = 0;
    for (const [at, length] of separators) { rows.push(tex.slice(start, at).trim()); start = at + length; }
    rows.push(tex.slice(start).trim());
    return `\\begin{gathered}${rows.filter(Boolean).map(row => layoutMath(row)).join(' \\\\[0.7em] ')}\\end{gathered}`;
  }
  if (relations.length < 2 || /\\(?:Rightarrow|Longrightarrow|implies)/.test(tex)) return tex;
  const rows = []; let start = 0;
  for (const [index, [at]] of relations.entries()) {
    if (index === 0) continue;
    rows.push(tex.slice(start, at).trim()); start = at;
  }
  rows.push(tex.slice(start).trim());
  const first = relations[0][0];
  rows[0] = `${rows[0].slice(0, first)}&${rows[0].slice(first)}`;
  return `\\begin{aligned}${rows[0]} \\\\[0.5em] ${rows.slice(1).map(row => '&' + row).join(' \\\\[0.5em] ')}\\end{aligned}`;
}

export function isWorkingMath(tex) {
  return /[=<>]|\\(?:approx|sim|int|sum|Longrightarrow|Rightarrow)/.test(tex);
}
