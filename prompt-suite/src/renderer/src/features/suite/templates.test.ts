import { describe, it, expect } from 'vitest';
import { promptTemplates } from './data';
import { VAR_META } from './varMeta';

const vars = (s: string) => new Set([...s.matchAll(/\{\{(\w+)\}\}/g)].map(m => m[1]));
const CATEGORIES = ['devops', 'security', 'writing', 'business', 'social', 'creative', 'coding', 'productivity'];

describe('plantillas integradas', () => {
  it('tienen ids únicos y categorías conocidas', () => {
    const ids = promptTemplates.map(t => t.id);
    expect(new Set(ids).size).toBe(ids.length);
    for (const t of promptTemplates) expect(CATEGORIES).toContain(t.category);
  });

  it('ES y EN usan exactamente las mismas variables y terminan con el idioma de salida', () => {
    for (const t of promptTemplates) {
      expect([...vars(t.prompt.es)].sort(), t.id).toEqual([...vars(t.prompt.en)].sort());
      expect(vars(t.prompt.es).has('LANG_OUTPUT'), t.id).toBe(true);
    }
  });

  it('las plantillas fusionadas ya no existen y las nuevas sí', () => {
    const ids = new Set(promptTemplates.map(t => t.id));
    for (const gone of ['twitter_thread', 'seo_blog_post', 'podcast_script', 'api_security_audit', 'product_ideation']) {
      expect(ids.has(gone), gone).toBe(false);
    }
    for (const added of ['social_post', 'blog_article', 'av_script', 'security_audit', 'code_review', 'improve_prompt']) {
      expect(ids.has(added), added).toBe(true);
    }
  });

  it('pentest_plan exige autorización', () => {
    const t = promptTemplates.find(x => x.id === 'pentest_plan')!;
    expect(vars(t.prompt.es).has('AUTHORIZATION')).toBe(true);
    expect(vars(t.prompt.en).has('AUTHORIZATION')).toBe(true);
  });

  it('los selects tienen las mismas opciones en ES y EN', () => {
    for (const [name, m] of Object.entries(VAR_META)) {
      if (m.type === 'select') {
        expect(m.options, name).toBeDefined();
        expect(m.options!.es.length, name).toBe(m.options!.en.length);
      }
    }
  });
});
