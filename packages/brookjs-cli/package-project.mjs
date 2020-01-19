import path from 'path';
import fs from 'fs';
import execa from 'execa';

const setUpProject = async (cwd, testAppDir) => {
  console.log('Creating a new project');

  await execa.command(`${path.join(cwd, 'bin', 'beaver.js')} new test-app -y`);
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

(async () => {
  try {
    const cwd = process.cwd();
    const testAppDir = path.join('test-app');
    const packagesRoot = path.join(cwd, '..');
    const tarballPath = path.join('features', 'support', 'test-app.tar.gz');

    console.log('Cleaning up old tarball & project');

    try {
      await Promise.all([
        execa.command(`rm -rf test-app`, { cwd }),
        execa.command(`rm ${tarballPath}`, { cwd })
      ]);
    } catch (err) {
      console.log('Tarball or project does not exist');
    }

    const [outputs] = await Promise.all([
      packPackages(packagesRoot),
      setUpProject(cwd, testAppDir)
    ]);

    console.log('Updating package.json to install from tarballs');

    const pkgJsonPath = path.join(testAppDir, 'package.json');
    const { stdout: pkgJson } = await execa.command(`cat ${pkgJsonPath}`);
    const newPkgJson = outputs.reduce(
      (pkgJson, { pkg, tarball }) =>
        pkgJson.replace(
          new RegExp(`("${pkg}":\\s".*")`),
          `"${pkg}": "${tarball}"`
        ),
      pkgJson
    );

    await fs.promises.writeFile(pkgJsonPath, newPkgJson);

    console.log('Installing the dependencies');

    await execa.command(`npm i`, {
      cwd: testAppDir
    });

    console.log('Tarballing test-app');

    await execa.command(`tar -cvzf ${tarballPath} test-app`, { cwd });

    console.log('Success!');
  } catch (err) {
    console.log(err.message);
    process.exitCode = 1;
  }
})();
