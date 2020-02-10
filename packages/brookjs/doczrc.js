export default {
  base: '/brookjs/',
  src: 'docs',
  typescript: true,
  menu: [
    {
      name: 'Home'
    },
    {
      name: 'Changelog'
    },
    {
      name: 'Getting Started',
      menu: [
        {
          name: 'Quickstart'
        }
      ]
    },
    {
      name: 'Walkthrough',
      menu: [
        { name: 'Introduction' },
        { name: 'What are Observables?' },
        { name: 'Props to Observables' },
        { name: 'Expressing Change Through Observables' },
        { name: 'Data In–Data Out' },
        { name: 'Todo List' },
        { name: 'Commands & Side Effects' },
        { name: 'Using the CLI' },
        { name: 'Testing: Unit & Integration' },
        { name: 'Static Typing with TypeScript' }
      ]
    },
    {
      name: 'Advanced Concepts',
      menu: [
        { name: 'Reactive Refs & Animations with `withRef$`' },
        { name: 'Using 3rd Party Components' },
        { name: 'Fractalizing Your Application' },
        { name: 'Building Reusable Components' }
      ]
    },
    {
      name: 'Philosophy',
      menu: [
        { name: 'Actions: Commands vs Events' },
        { name: 'Components Compose Bottom Up' },
        { name: 'Best Choice is Easiest' },
        { name: 'Seamless Interop' }
      ]
    },
    {
      name: 'API',
      menu: [
        { name: 'brookjs' },
        { name: 'brookjs-desalinate' },
        { name: 'brookjs-cli' },
        { name: 'brookjs-silt' },
        { name: 'babel-preset-brookjs' }
      ]
    }
  ]
};
