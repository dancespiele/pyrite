import * as m from "mithril";

export const RouteParams: any = {}

export class Router {
	routes: any;
	rootElement: any;
	rootPath: string;
	config: any;

	constructor(config: any) {
		this.rootElement = config.rootElement || document.body;
		this.rootPath = config.rootPath || "/";

		if (config.prefix) m.route.prefix(config.prefix);

		this.config = config;
		this.routes = this.buildRoutes(config.routes);
	}

	buildRoutes(configRoutes: any, currentRoutes: Array<any> = [], routes: any = {}): any {
		configRoutes.forEach((route: any) => {
			const nextRoutes = currentRoutes.slice();
			nextRoutes.unshift(route);
			let path = nextRoutes.reverse().map((element) => element.path).join("");

			path = path.split("//").join("/");

			if (path[0] !== "/") path = "/" + path;

			const fooRoutes = nextRoutes.slice();
			const lastRoute = fooRoutes.pop();

			let oldPath = this.rootPath;

			routes[path] = this.createRoute(fooRoutes, lastRoute, this.config);

			if (route.routes) {
				this.buildRoutes(route.routes, nextRoutes, routes);
			}
		});

		return routes;
	}

	createRoute(fooRoutes: any, lastRoute: any, config: any) {
		const route: any = {
			onbeforeupdate(newArgs: any, oldArgs: any) {
				if (this.component.state.$onRouteUpdate) {
					this.component.state.$onRouteUpdate(newArgs, oldArgs);
				}
			},
			onupdate() {
				if (config.onRouteChange) config.onRouteChange(m.route.get());
			},
			view(args: any) {
				if (!Object.keys(args.attrs).length) {
					Object.keys(RouteParams).forEach((attr) => {
						delete RouteParams[attr];
					});
	            } else {
	            	Object.assign(RouteParams, args.attrs);
	            }

				const render = fooRoutes.reduce((prev: any, next: any) => {
					return m(next.component, next.attrs, prev);
				}, m(lastRoute.component, lastRoute.attrs));

				this.component = render;

				return render;
			}
		};

		return route;
	}

	run() {
		m.route(this.rootElement, this.rootPath, this.routes);
	}
}
