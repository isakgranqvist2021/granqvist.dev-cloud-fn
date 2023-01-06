import ejs from 'ejs';
import type { Request, Response } from 'express';
import type { IncomingMessage } from 'http';
import https from 'https';

interface Repository {
  description: string | null;
  homepage: string | null;
  html_url: string;
  language: string | null;
  name: string;
  pushed_at: string;
}

const include = new Set([
  'BehanceDesignUI',
  'isakgranqvist.com',
  'MultiplayerChess',
  'VPNFinder',
  'DropStore',
  'GodaddyAffiliate',
]);

const repositoryMapper = (repository: any): Repository | null => {
  try {
    if (!include.has(repository.name)) {
      return null;
    }

    return {
      name: repository.name,
      html_url: repository.html_url,
      description: repository.description,
      homepage: repository.homepage,
      language: repository.language.toLowerCase(),
      pushed_at: new Date(repository.pushed_at).toLocaleDateString(),
    };
  } catch {
    return null;
  }
};

export const getRepositoriesFromGithub = async (): Promise<
  Repository[] | null
> =>
  new Promise((resolve, reject) => {
    const callback = (res: IncomingMessage) => {
      let str = '';

      res.on('data', (chunk: any) => {
        str += chunk;
      });

      res.on('end', () => {
        try {
          const allRepos: Repository[] = JSON.parse(str);
          const repositories = allRepos.map(repositoryMapper);

          resolve(
            repositories.filter(
              (repository): repository is Repository => repository !== null,
            ),
          );
        } catch {
          reject();
        }
      });

      res.on('error', reject);
    };

    https.get(
      'https://api.github.com/user/repos',
      {
        headers: {
          'User-Agent': '',
          Accept: 'application/vnd.github+json',
          Authorization: `token ${process.env.GITHUB_ACCESS_TOKEN}`,
        },
      },
      callback,
    );
  });

export const handler = async (_: Request, res: Response) => {
  try {
    res.setHeader('Content-Type', 'text/html');

    const repositories = await getRepositoriesFromGithub();
    const html = await ejs.renderFile('./views/index.ejs', { repositories });

    res.send(html);
  } catch {
    res.status(500).send('Internal server error');
  }
};
