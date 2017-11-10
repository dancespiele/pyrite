var cleanup = require('jsdom-global')()
import { expect, assert } from "chai";

import { TestComponent, draw } from "./mocks";
import { PyriteComponent } from "../../src/component";

describe('Decorators', () => {
	let component: any = draw(TestComponent);

	before(() => {
		component = draw(TestComponent);
	});

	it('should create a component correctly', () => {
		expect(component.state.loaded).to.be.true;
	});

	it('should inject children correctly', () => {
		expect(component.state.children).to.not.be.undefined;
		expect(component.state.children[0]).to.deep.include({ text: "Children" });
	});

	it('should inject attributes correctly', () => {
		expect(component.state.attrs).to.not.be.undefined;
		expect(component.state.attrs.example).to.equal('value');
	});

	it('should inject refs correctly', () => {
		expect(component.state.refs).to.not.be.undefined;
		expect(component.state.refs.example).to.be.an.instanceof(HTMLElement);
		expect(component.state.refs.component.loaded).to.be.true;
		expect(component.state.refs.subcomponent).to.be.undefined;
	});

	it('should inject routeparams correctly', () => {
		expect(component.state.params).to.not.be.undefined;
	});

	it('should inject injections correctly', () => {
		expect(component.state.service).to.not.be.undefined;
		expect(component.state.serviceGet).to.not.be.undefined;
	});
});