import 'brookjs-desalinate/extend-expect';
import chalk from 'chalk';

chalk.level = chalk.Level.TrueColor;
chalk.supportsColor = {
  level: chalk.Level.TrueColor,
  hasBasic: true,
  has256: true,
  has16m: true
};
