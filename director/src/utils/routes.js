import { filesInDir } from "./dirs.js";

export async function importRoutes(router) {
  const rootRoutes = await filesInDir('src/routes', ['index.js']);
  for (const route of rootRoutes.content) {
    const routes = await filesInDir(`src/routes/${route}`);
    for (const file of routes.content) {
      if (file.endsWith('.js')) {
        const routePath = `/${route}/${file.replace('.js', '')}`;
        const routeModule = await import(`../routes/${route}/${file}`);
        for (const method of Object.keys(routeModule)) {
          console.log(method.toLowerCase(), routePath);
          router[method.toLowerCase()](routePath, async (req, res) => {
            return await routeModule[method](req, res);
          })
        }
      }
    }
  }
}