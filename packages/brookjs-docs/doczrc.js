export default {
  base: '/brookjs/',
  src: 'docs',
  typescript: true,
  gatsbyRemarkPlugins: [
    {
      resolve: 'gatsby-remark-embedded-codesandbox',
      options: {
        directory: `${__dirname}/examples/`,
        getIframe: url =>
          `<iframe src="${url}" width="600px" height="500px" class="embedded-codesandbox" sandbox="allow-modals allow-forms allow-popups allow-scripts allow-same-origin"></iframe>`
      }
    },
    {
      resolve: 'gatsby-remark-responsive-iframe'
    }
  ],
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
        { name: 'Emitting Component Events Through Observables' },
        { name: 'Making a Todo List' },
        { name: 'Commands, Deltas, & Side Effects' },
        { name: 'Testing: Format, Lint, & Unit' }
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
        { name: 'Best Choice is Easiest' }
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
