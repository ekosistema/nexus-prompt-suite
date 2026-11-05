import { describe, it, expect } from 'vitest';
import { genesisFields, devFields, auditFields, studioFields, socialFields } from './formSchemas';

// Guardia YAGNI: un formulario con muchos campos casi siempre vacíos empeora el prompt.
const MAX_FIELDS = 8;

describe('formularios', () => {
  const forms = { genesisFields, devFields, auditFields, studioFields, socialFields };

  for (const [name, fields] of Object.entries(forms)) {
    it(`${name} se mantiene corto y sin ids duplicados`, () => {
      expect(fields.length).toBeLessThanOrEqual(MAX_FIELDS);
      const ids = fields.map(f => f.id);
      expect(new Set(ids).size).toBe(ids.length);
    });
  }
});
