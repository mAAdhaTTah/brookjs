import React from 'react';

const KEY = 'brookjs-docz-releases';

const Error = ({ message, stack, C }) => (
    <div>
        <C.h2>An error occurred!</C.h2>
        <C.p>{message}</C.p>
        {stack ? (<pre>{stack}</pre>) : null}
    </div>
);

const Releases = ({ releases, C }) => (
    <C.ul>
        {releases.map(release => (
            <li key={release.id} style={{ 'display': 'block' }}>
                <section>
                    <C.h2>{release.tag_name}</C.h2>
                    {release.tag_name !== release.name ? <C.h3>{release.name}</C.h3> : null}
                    <C.p dangerouslySetInnerHTML={{ __html: release.body }} />
                </section>
            </li>
        ))}
    </C.ul>
);

export default class Changelog extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            releases: [],
            error: false,
            message: ''
        };
    }

    async componentDidMount() {
        try {
            const storage = localStorage.getItem(KEY);

            if (storage) {
                return this.setState({ releases: JSON.parse(storage) });
            }

            const response = await fetch('https://api.github.com/repos/valtech-nyc/brookjs/releases', {
                method: 'GET'
            });

            // @todo parse header for link to add pagination
            const body = await response.json();

            if (!response.ok) {
                throw new Error(body.message);
            }

            const releases = await Promise.all(body.map(async release => {
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
            }));

            window.localStorage.setItem(KEY, JSON.stringify(releases));

            this.setState({ releases });
        } catch (e) {
            this.setState({ error: true, message: e.message, stack: e.stack });
        }
    }

    render() {
        const { comps: C } = this.props;
        const { error, message, stack, releases } = this.state;

        if (error) {
            return <Error {...{ message, stack, C }} />;
        }

        if (!releases.length) {
            return <C.loading />;
        }

        return <Releases {...{ C, releases } } />;
    }
}
