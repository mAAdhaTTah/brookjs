import path from 'path';
import fs from 'fs';
import execa from 'execa';

const projectName = type => `test-app-${type}`;

const setUpProject = async (cwd, type) => {
  console.log('Creating a new project');

  await execa.command(
    `${path.join('./', 'bin', 'beaver.js')} new ${projectName(type)} -y${
      type === 'ts' ? ' --ts' : ''
    }`,
    { cwd }
  );
};

const packPackages = async packagesRoot => {
  console.log('Packing all of the packages');

  const pkgs = (await fs.promises.readdir(packagesRoot)).filter(
    pkg => pkg !== '.DS_Store'
  );

  return await Promise.all(
    pkgs.map(pkg =>
      execa
        .command(`yarn pack`, {
          cwd: path.join(packagesRoot, pkg)
        })
        .then(() => fs.promises.readdir(path.join(packagesRoot, pkg)))
        .then(files => ({
          pkg,
          tarball: path.join(
            packagesRoot,
            pkg,
            files.find(file => file.endsWith('.tgz'))
          )
        }))
    )
  );
};

const tarballPath = type =>
  path.join('features', 'support', `${projectName(type)}.tar.gz`);
const projectPath = (cwd, type) => path.join(cwd, projectName(type));

const cleanupOld = (cwd, type) =>
  Promise.all([
    execa.command(`rm -rf ${projectName(type)}`, { cwd }),
    execa.command(`rm ${tarballPath(type)}`, { cwd })
  ]);

const updatePkgJson = async (cwd, outputs, type) => {
  console.log('Updating package.json to install from tarballs');

  const pkgJsonPath = path.join(projectPath(cwd, type), 'package.json');
  const { stdout: pkgJson } = await execa.command(`cat ${pkgJsonPath}`);
  const newPkgJson = JSON.parse(pkgJson);
  newPkgJson.resolutions = {};

  // Ensure all packages are resolved from our tarballs.
  for (const { pkg, tarball } of outputs) {
    newPkgJson.resolutions[pkg] = `file:${tarball}`;

    if (newPkgJson.dependencies[pkg]) {
      newPkgJson.dependencies[pkg] = `file:${tarball}`;
    }

    if (newPkgJson.devDependencies[pkg]) {
      newPkgJson.devDependencies[pkg] = `file:${tarball}`;
    }
  }

  await fs.promises.writeFile(
    pkgJsonPath,
    JSON.stringify(newPkgJson, null, '  ')
  );
};

const installDeps = async (cwd, type) => {
  console.log('Installing the dependencies');

  await execa.command(`yarn`, {
    cwd: projectPath(cwd, type)
  });
};

const tarballPackage = async (cwd, type) => {
  console.log(`Tarballing ${projectName(type)}`);
  await execa.command(`tar -cvzf ${tarballPath(type)} ${projectName(type)}`, {
    cwd
  });
};

(async () => {
  try {
    const cwd = process.cwd();
    const packagesRoot = path.join(cwd, '..');

    console.log('Cleaning up old tarball & project');

    try {
      await Promise.all([cleanupOld(cwd, 'js'), cleanupOld(cwd, 'ts')]);
    } catch (err) {
      console.log('Tarball or project does not exist');
    }

    const [outputs] = await Promise.all([
      packPackages(packagesRoot),
      setUpProject(cwd, 'js'),
      setUpProject(cwd, 'ts')
    ]);

    await Promise.all([
      updatePkgJson(cwd, outputs, 'js'),
      updatePkgJson(cwd, outputs, 'ts')
    ]);

    await installDeps(cwd, 'js');
    await installDeps(cwd, 'ts');

    await Promise.all([tarballPackage(cwd, 'js'), tarballPackage(cwd, 'ts')]);

    console.log('Success!');
  } catch (err) {
    console.log(err.message);
    process.exitCode = 1;
  }
})();
