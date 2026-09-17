import fs from 'node:fs';
import path from 'node:path';
import ts from 'typescript';

const root = process.cwd();
const componentsRoot = path.join(root, 'src/components');
const storyPath = path.join(componentsRoot, 'ComponentCatalog.stories.tsx');
const forbiddenInteractiveImports = new Set(['Button', 'Modal', 'Pressable', 'Switch', 'TextInput', 'TouchableHighlight', 'TouchableOpacity', 'TouchableWithoutFeedback']);

const categories = {
  actions: ['Button', 'IconButton'],
  forms: ['Checkbox', 'Chip', 'ChipGroup', 'Radio', 'SearchField', 'Switch', 'TextField'],
  navigation: ['AppBottomNav', 'AppHeader'],
  'data-display': ['Avatar', 'IconTile', 'ListItem', 'NumberBadge', 'Tag', 'Tile', 'TileGroup'],
  layout: ['ActionFooter', 'ListGroup', 'SectionHeader', 'SurfaceCard', 'TileGrid'],
  feedback: ['Banner', 'ProgressSteps'],
  overlays: ['ModalSheet'],
  patterns: ['CategoryStatTile', 'ListingCard', 'ReviewCard'],
  internal: ['IconPlaceholder', 'ScreenFrame'],
};
const storyExempt = new Set(['IconPlaceholder', 'ScreenFrame']);
const expected = Object.values(categories).flat().sort();
const errors = [];

for (const [category, names] of Object.entries(categories)) {
  const barrel = path.join(componentsRoot, category, 'index.ts');
  if (!fs.existsSync(barrel)) {
    errors.push(`Missing category barrel: src/components/${category}/index.ts`);
    continue;
  }
  const source = fs.readFileSync(barrel, 'utf8');
  for (const name of names) {
    if (!source.includes(name)) errors.push(`${name} is not registered in ${category}/index.ts`);
  }
}

const publicIndex = fs.readFileSync(path.join(componentsRoot, 'index.ts'), 'utf8');
for (const category of Object.keys(categories)) {
  if (!publicIndex.includes(`export * from './${category}'`)) errors.push(`${category} is missing from the public component index`);
}

const story = fs.existsSync(storyPath) ? fs.readFileSync(storyPath, 'utf8') : '';
for (const name of expected) {
  if (!storyExempt.has(name) && !new RegExp(`\\b${name}\\b`).test(story)) errors.push(`${name} is missing from the production Storybook catalog`);
}

const screenDir = path.join(root, 'src/screens');
for (const entry of fs.readdirSync(screenDir)) {
  if (!entry.endsWith('.tsx')) continue;
  const file = path.join(screenDir, entry);
  const source = fs.readFileSync(file, 'utf8');
  const ast = ts.createSourceFile(file, source, ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX);
  for (const statement of ast.statements) {
    if (!ts.isImportDeclaration(statement)) continue;
    const importPath = statement.moduleSpecifier.text;
    if (importPath.startsWith('../components/')) {
      errors.push(`${path.relative(root, file)} bypasses the public component barrel with ${importPath}`);
    }
    if (importPath !== 'react-native') continue;
    if (statement.importClause?.isTypeOnly) continue;
    const bindings = statement.importClause?.namedBindings;
    if (!bindings || !ts.isNamedImports(bindings)) continue;
    for (const specifier of bindings.elements) {
      if (!specifier.isTypeOnly && forbiddenInteractiveImports.has(specifier.name.text)) {
        errors.push(`${path.relative(root, file)} imports forbidden native interactive primitive ${specifier.name.text}`);
      }
    }
  }
}

if (fs.existsSync(path.join(root, 'storybook/src/components'))) errors.push('Legacy copied Storybook components still exist');

if (errors.length) {
  console.error('Component-system violations found:');
  for (const error of errors) console.error(`- ${error}`);
  process.exit(1);
}

console.log(`Component system validated: ${expected.length} classified public exports, production stories, and clean screen imports.`);
