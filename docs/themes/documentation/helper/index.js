var request = require('sync-request');
var handlebars = require('handlebars/runtime');

module.exports = function helper(hexo) {
    var helpers = hexo.extend.helper.list();

    return {
        compare: function compare(prev, next) {
            return prev === next;
        },
        changelog: function changelog() {
            const response = request(
                'GET',
                'https://api.github.com/repos/valtech-nyc/brookjs/releases',
                {
                    'headers': {
                        'user-agent': 'hexo-site-generator'
                    }
                }
            );
            const releases = JSON.parse(response.getBody('utf-8'));

            return new handlebars.SafeString(releases.map(release => {
                return `<h2>${release.tag_name}</h2>${helpers.markdown(release.body)}`;
            })
                .join('\n'));
        }
    };
};
