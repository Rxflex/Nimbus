import { filesInDir } from "./dirs.js";
import logger from "./logger.js";
import { AuthGuard } from "./guard.js";
import pjson from "../../package.json" with { type: 'json' };

async function loadFilesRecursively(basePath, routeBase, router) {
  const items = await filesInDir(basePath);
  for (const item of items.content) {
    const fullPath = `${basePath}/${item}`;
    if (item.endsWith('.js')) {
      const routePath = `/${routeBase}/${item.replace('.js', '')}`;

      let role = null;
      const segments = routePath.split('/').filter(Boolean); // ['v1', 'admin', ...]
      if (segments[0] === 'v1') {
        if (segments[1] === 'admin') role = 'admin';
        else if (segments[1] === 'agent') role = 'agent';
      }

      const routeModule = await import(`../routes/${routeBase}/${item}`);
      for (const method of Object.keys(routeModule)) {
        logger.log(`Importing route: ${method.toLowerCase()} ${routePath}`);
        router[method.toLowerCase()](routePath, async (req, res) => {
          if (!await AuthGuard(req.headers.authorization, role)) {
            return res.status(403).json({ status: false, message: 'Forbidden: Authentication required' });
          }
          res.setHeader('X-Powered-By', `${pjson.name}/${pjson.version}`);
          return routeModule[method](req, res);
        });
      }
    } else {
      await loadFilesRecursively(fullPath, `${routeBase}/${item}`, router);
    }
  }
}

export async function importRoutes(router) {
  const rootRoutes = await filesInDir('src/routes', ['index.js']);
  for (const route of rootRoutes.content) {
    await loadFilesRecursively(`src/routes/${route}`, route, router);
  }
}
