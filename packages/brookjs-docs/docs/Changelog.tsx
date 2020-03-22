import React from 'react';
import C from 'gatsby-theme-docz/src/components';

const KEY = 'brookjs-docz-releases';

const LoadError = ({ message, stack }) => (
  <div>
    <C.h2>An error occurred!</C.h2>
    <p>{message}</p>
    {stack ? <pre>{stack}</pre> : null}
  </div>
);

const Releases = ({ releases }) => (
  <ul>
    {releases.map(release => (
      <li key={release.id} style={{ display: 'block' }}>
        <section>
          <C.h2>{release.tag_name}</C.h2>
          {release.tag_name !== release.name ? (
            <C.h3>{release.name}</C.h3>
          ) : null}
          <p dangerouslySetInnerHTML={{ __html: release.body }} />
        </section>
      </li>
    ))}
  </ul>
);

type State = {
  error: boolean;
  message?: string;
  stack?: string;
  releases: Array<{}>;
};

const fetchRelease = async (release: { body: any }) => {
  if (!release.body) {
    return release;
  }

  const response = await fetch('https://api.github.com/markdown', {
    method: 'POST',
    body: JSON.stringify({
      text: release.body
    })
  });

  if (!response.ok) {
    throw new Error((await response.json()).message);
  }

  return { ...release, body: await response.text() };
};

const fetchReleases = async () => {
  const response = await fetch(
    'https://api.github.com/repos/mAAdhaTTah/brookjs/releases',
    {
      method: 'GET'
    }
  );
  // @todo parse header for link to add pagination
  const body = await response.json();
  if (!response.ok) {
    throw new Error(body.message);
  }
  return body;
};

export default class Changelog extends React.Component<{}, State> {
  state: State = {
    error: false,
    releases: []
  };

  async componentDidMount() {
    try {
      const storage = localStorage.getItem(KEY);

      if (storage) {
        return this.setState({ releases: JSON.parse(storage) });
      }

      const body = await fetchReleases();

      const releases = await Promise.all(body.map(fetchRelease));

      window.localStorage.setItem(KEY, JSON.stringify(releases));

      this.setState({ releases });
    } catch (e) {
      this.setState({ error: true, message: e.message, stack: e.stack });
    }
  }

  render() {
    const { error, message, stack, releases } = this.state;

    if (error) {
      return <LoadError {...{ message, stack }} />;
    }

    if (!releases.length) {
      return <C.h2>Loading...</C.h2>;
    }

    return <Releases {...{ releases }} />;
  }
}
