
import { apply, chain, externalSchematic, MergeStrategy, mergeWith,    Rule, SchematicContext, strings, template, Tree, url } from '@angular-devkit/schematics';
import { Schema as ApplicationOptions, Style } from '@schematics/angular/ng-new/schema';
// import { Schema as MyScematicOptions } from './schema';


// You don't have to export the function as default. You can also have more than one rule factory
// per file.
export function newProjectByGiorgi(_options: any): Rule {
  // console.log('Hello from your new schematic!',_options)
  const name = _options.name;
  console.log('name', name);

  return (tree: Tree, _context: SchematicContext) => {
    const templateSource = apply(url('../../src/project-template'), [
      template({..._options,...strings}),
    ]);

    const merged = mergeWith(templateSource, MergeStrategy.Overwrite)
  
    const rule = chain([
      generateAngularApp(name),
      merged,
      updatePackageJson(name),
    ]);
  
    return rule(tree, _context) as Rule;
   
  };

 
}

function generateAngularApp(name:string): Rule {
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
}


function updatePackageJson(name: string): Rule {
  return (tree: Tree, _: SchematicContext): Tree => {
    const path = `/${name}/package.json`;
    const file = tree.read(path);
    const json = JSON.parse(file!.toString());
   
    json.scripts = {
      ...json.scripts,
      'build:prod': 'ng build --prod',
      test: 'ng test --code-coverage',
      lint: 'ng lint --fix',
    };
   
    json.husky = {
      'hooks': {
        'pre-commit': 'pretty-quick --staged --pattern \"apps/**/**/*.{ts,scss,html}\"',
      }
    };
   
    json.devDependencies.prettier = '^2.0.0';
    json.devDependencies.husky = '^4.2.0';
    json.devDependencies['jest-preset-angular'] = '^11.1.1';
    json.devDependencies.jest = '^27.5.1';

    tree.overwrite(path, JSON.stringify(json, null, 2));
    return tree;
  }
 }

// quicktype --src 'src/new-project/schema.josn' --src-lang json --lang typescript --top-level IMyScematicOptions --out IMyScematicOptions.ts