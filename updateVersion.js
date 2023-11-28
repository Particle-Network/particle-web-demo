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

    const loadPkgData = async (page) => {
        const response = await axios.get('https://www.npmjs.com/search', {
            params: {
                q: '@particle-network',
                perPage: 20,
                page: page,
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
                'sec-fetch-site': 'none',
                'cf-cache-status': 'DYNAMIC',
                'cache-control': 'no-cache',
                pragma: 'no-cache',
                'user-agent':
                    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/105.0.0.0 Safari/537.36',
                'x-requested-with': 'XMLHttpRequest',
                'x-spiferack': '1',
            },
        });
        const reuslt = response.data.objects.map((item) => ({
            name: item.package.name,
            version: item.package.version,
        }));
        return {
            total: response.data.total,
            result: reuslt,
        };
    };
    try {
        const newVersions = [];
        const response = await loadPkgData(0);
        newVersions.push(...response.result);

        if (response.total > 20) {
            const pages = Math.ceil(response.total / 20);
            for (let i = 1; i < pages; i++) {
                const response = await loadPkgData(i);
                newVersions.push(...response.result);
            }
        }

        packageSrc.forEach((srcPath) => {
            let packageContent = fs.readFileSync(srcPath, 'utf8');
            newVersions.forEach(({ name, version }) => {
                const reg = new RegExp(`"${name}": ".*"`, 'g');
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
