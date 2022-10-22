import { MainRoute } from "./core/api/routes/main.route";

function setup(app: any): void {
  try {
    const route: MainRoute = new MainRoute();
    route.register(app);
  } catch (err) {
    throw new Error('Routes not registered!');
  }
}

export { setup };