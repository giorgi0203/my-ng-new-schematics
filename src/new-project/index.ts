import { externalSchematic, Rule, SchematicContext, Tree } from '@angular-devkit/schematics';
import { Schema as ApplicationOptions, Style } from '@schematics/angular/ng-new/schema';
// import { Schema as MyScematicOptions } from './schema';


// You don't have to export the function as default. You can also have more than one rule factory
// per file.
export function newProject(_options: any): Rule {
  // console.log('Hello from your new schematic!',_options)
  const name = _options.name;
  console.log('name', name);

  return (_: Tree, _context: SchematicContext) => {
    const options: ApplicationOptions = {
      name,
      version: '9.0.0',
      directory: name,
      routing: true,
      skipTests: true,
      skipInstall: true,
      style: Style.Scss,
      inlineStyle: false,
      inlineTemplate: false
    }
    return externalSchematic('@schematics/angular', 'ng-new', options);
  };
}
// quicktype --src 'src/new-project/schema.josn' --src-lang json --lang typescript --top-level IMyScematicOptions --out IMyScematicOptions.ts