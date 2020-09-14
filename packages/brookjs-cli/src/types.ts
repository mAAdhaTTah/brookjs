import * as project from './project';
import * as webpack from './webpack';

export type RootAction = project.Action | webpack.Action;
