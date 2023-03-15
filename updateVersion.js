/* eslint-disable @typescript-eslint/no-var-requires */
const axios = require('axios');
const fs = require('fs');
const path = require('path');

const packageSrc = [];
const packagesDir = path.join(__dirname, './packages/');
var readDir = fs.readdirSync(packagesDir);
readDir.forEach((item) => {
    if (!item.startsWith('.')) {
        const jsonPath = `${packagesDir}${item}/package.json`;
        if (fs.existsSync(jsonPath)) {
            packageSrc.push(jsonPath);
        }
    }
});

(async () => {
    console.log('--START--');
    try {
        const response = await axios.get('https://www.npmjs.com/search', {
            params: {
                q: '@particle-network',
                timestamp: new Date().getTime(),
            },
            headers: {
                authority: 'www.npmjs.com',
                accept: '*/*',
                'accept-language': 'zh-CN,zh;q=0.9,en;q=0.8',
                referer: 'https://www.npmjs.com/search?q=%40particle-network',
                'sec-ch-ua-mobile': '?0',
                'sec-ch-ua-platform': 'macOS',
                'sec-fetch-dest': 'empty',
                'sec-fetch-mode': 'cors',
                'sec-fetch-site': 'same-origin',
                'user-agent':
                    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/105.0.0.0 Safari/537.36',
                'x-requested-with': 'XMLHttpRequest',
                'x-spiferack': '1',
            },
        });
        const newVersions = response.data.objects.map((item) => ({
            name: item.package.name,
            version: item.package.version,
        }));
        packageSrc.forEach((srcPath) => {
            let packageContent = fs.readFileSync(srcPath, 'utf8');
            newVersions.forEach(({ name, version }) => {
                const reg = new RegExp(`"${name}": ".*"`);
                packageContent = packageContent.replace(reg, (substring) => {
                    const replacement = `"${name}": "^${version}"`;
                    console.log(`${substring} -> ${replacement}`);
                    return replacement;
                });
            });
            fs.writeFileSync(srcPath, packageContent);
        });
    } catch (error) {
        console.log(error);
    }
    console.log('--END--');
})();
