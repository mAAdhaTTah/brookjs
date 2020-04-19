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

const tarballNames = {};

const getTarballName = async (packagesRoot, pkg) => {
  if (tarballNames[pkg]) {
    return tarballNames[pkg];
  }
  try {
    const pkgJsonPath = path.join(packagesRoot, pkg, 'package.json');
    const pkgJson = JSON.parse(await fs.readFile(pkgJsonPath, 'utf-8'));

    return tarballNames[pkg] = `${pkg}-v${pkgJson.version}.tgz`;
  } catch (err) {
    throw new Error(
      `Error occurred getting tarball name for ${pkg}: ${err.message}`,
    );
  }
};

const packPackage = async (packagesRoot, pkg) => {
  const packagePath = path.join(packagesRoot, pkg);
  const pkgJsonPath = path.join(packagePath, 'package.json');
  const oldPkgJson = await fs.readFile(pkgJsonPath, 'utf-8');
  const newPkgJson = JSON.parse(oldPkgJson);

  for (const dep in newPkgJson.dependencies) {
    if (dep.includes('brookjs')) {
      newPkgJson.dependencies[dep] = `file:${path.join(
        packagesRoot,
        dep,
        await getTarballName(packagesRoot, dep),
      )}`;
    }
  }

  for (const devDep in newPkgJson.devDependencies) {
    if (devDep.includes('brookjs')) {
      newPkgJson.dependencies[devDep] = `file:${path.join(
        packagesRoot,
        devDep,
        await getTarballName(packagesRoot, devDep),
      )}`;
    }
  }

  try {
    await fs.writeFile(pkgJsonPath, JSON.stringify(newPkgJson, null, '  '));

    await execa.command(`yarn pack`, {
      cwd: packagePath,
    });

    return {
      pkg,
      tarball: path.join(
        packagesRoot,
        pkg,
        await getTarballName(packagesRoot, pkg),
      ),
    };
  } finally {
    await fs.writeFile(pkgJsonPath, oldPkgJson);
  }
};

const packPackages = async packagesRoot => {
  console.log('Packing all of the packages');

  const pkgs = (await fs.readdir(packagesRoot)).filter(
    pkg => pkg !== '.DS_Store',
  );

  return Promise.all(pkgs.map(pkg => packPackage(packagesRoot, pkg)));
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
  const pkgJson = await fs.readFile(pkgJsonPath, 'utf-8');
  const newPkgJson = JSON.parse(pkgJson);

  // Ensure all packages are resolved from our tarballs.
  for (const { pkg, tarball } of outputs) {
    if (newPkgJson.dependencies[pkg]) {
      newPkgJson.dependencies[pkg] = `file:${tarball}`;
    }

    if (newPkgJson.devDependencies[pkg]) {
      newPkgJson.devDependencies[pkg] = `file:${tarball}`;
    }
  }

  await fs.writeFile(pkgJsonPath, JSON.stringify(newPkgJson, null, '  '));
};

const installDeps = async (cwd, type) => {
  console.log('Installing the dependencies');

  await execa.command(`yarn`, {
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
    console.log(err.stack);
    process.exitCode = 1;
  }
})();
