declare module 'esm' {
  const esm: (module: NodeModule) => NodeRequireFunction;

  export default esm;
}
