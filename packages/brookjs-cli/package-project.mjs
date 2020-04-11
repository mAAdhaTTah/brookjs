import path from 'path';
import fs from 'fs-extra';
import execa from 'execa';

const projectName = type => `test-app-${type}`;

const setUpProject = async (cwd, type) => {
  console.log('Creating a new project');

  await execa.command(
    `${path.join('./', 'bin', 'beaver.js')} new ${projectName(type)} -y${
      type === 'ts' ? ' --ts' : ''
    }`,
    { cwd },
  );
};

const packPackages = async packagesRoot => {
  console.log('Packing all of the packages');

  const pkgs = (await fs.readdir(packagesRoot)).filter(
    pkg => pkg !== '.DS_Store',
  );

  return await Promise.all(
    pkgs.map(pkg =>
      execa
        .command(`npm pack`, {
          cwd: path.join(packagesRoot, pkg),
        })
        .then(() => fs.readdir(path.join(packagesRoot, pkg)))
        .then(async files => ({
          pkg,
          tarball: path.join(
            packagesRoot,
            pkg,
            files.find(file => file.endsWith('.tgz')),
          ),
        })),
    ),
  );
};

const tarballPath = type =>
  path.join('features', 'support', `${projectName(type)}.tar.gz`);
const projectPath = (cwd, type) => path.join(cwd, projectName(type));

const cleanupOld = (cwd, type) =>
  Promise.all([
    execa.command(`rm -rf ${projectName(type)}`, { cwd }),
    execa.command(`rm ${tarballPath(type)}`, { cwd }),
  ]);

const updatePkgJson = async (cwd, outputs, type) => {
  console.log('Updating package.json to install from tarballs');

  const pkgJsonPath = path.join(projectPath(cwd, type), 'package.json');
  const { stdout: pkgJson } = await execa.command(`cat ${pkgJsonPath}`);
  const newPkgJson = JSON.parse(pkgJson);
  newPkgJson.resolutions = {};

  // Ensure all packages are resolved from our tarballs.
  for (const { pkg, tarball } of outputs) {
    if (newPkgJson.dependencies[pkg]) {
      newPkgJson.dependencies[pkg] = `file:${tarball}`;
    } else {
      newPkgJson.devDependencies[pkg] = `file:${tarball}`;
    }
  }

  await fs.writeFile(
    pkgJsonPath,
    JSON.stringify(newPkgJson, null, '  '),
  );
};

const installDeps = async (cwd, type) => {
  console.log('Installing the dependencies');

  await execa.command(`npm i`, {
    cwd: projectPath(cwd, type),
  });
};

const tarballPackage = async (cwd, type) => {
  console.log(`Tarballing ${projectName(type)}`);
  await execa.command(`tar -cvzf ${tarballPath(type)} ${projectName(type)}`, {
    cwd,
  });
};

(async () => {
  try {
    let makeJs = process.argv.includes('--js');
    let makeTs = process.argv.includes('--ts');

    // If neither set, build both.
    if (!makeJs && !makeTs) {
      makeJs = makeTs = true;
    }

    const cwd = process.cwd();
    const packagesRoot = path.join(cwd, '..');

    console.log('Cleaning up old tarball & project');

    try {
      await Promise.all([
        makeJs && cleanupOld(cwd, 'js'),
        makeTs && cleanupOld(cwd, 'ts'),
      ]);
    } catch (err) {
      console.log('Tarball or project does not exist');
    }

    const [outputs] = await Promise.all([
      packPackages(packagesRoot),
      makeJs && setUpProject(cwd, 'js'),
      makeTs && setUpProject(cwd, 'ts'),
    ]);

    await Promise.all([
      makeJs && updatePkgJson(cwd, outputs, 'js'),
      makeTs && updatePkgJson(cwd, outputs, 'ts'),
    ]);

    await (makeJs && installDeps(cwd, 'js'));
    await (makeTs && installDeps(cwd, 'ts'));

    await Promise.all([
      makeJs && tarballPackage(cwd, 'js'),
      makeTs && tarballPackage(cwd, 'ts'),
    ]);

    console.log('Success!');
  } catch (err) {
    console.log(err.message);
    process.exitCode = 1;
  }
})();
