import { collectLintViolations } from './lib/token-lint.mjs';

export function validateTokenUsage() {
  const violations = collectLintViolations();

  if (violations.length) {
    console.error('Token lint violations found:');
    for (const v of violations) {
      console.error(`- ${v.file}:${v.line} [${v.kind}] ${v.detail}`);
    }
    return { ok: false, violations };
  }

  console.log('Token usage validation passed.');
  return { ok: true, violations: [] };
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const result = validateTokenUsage();
  if (!result.ok) process.exit(1);
}
