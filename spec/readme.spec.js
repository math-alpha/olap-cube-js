import Cube from '../src/Cube.js';
import {isEqual, jsonParseStringify} from './helpers/helpers.js'

describe('readme', ()=>{
	// This is an array of data from server
	let facts = [
		{ id: 1, region: 'North', year: 2017, month: 'January', product: 'Product 1', category: 'Category 1', value: 737 },
		{ id: 2, region: 'South', year: 2017, month: 'April',   product: 'Product 2', category: 'Category 1', value: 155 },
		{ id: 3, region: 'West',  year: 2018, month: 'April',   product: 'Product 3', category: 'Category 2', value: 112 },
		{ id: 4, region: 'West',  year: 2018, month: 'April',   product: 'Product 1', category: 'Category 2', value: 319 },
	]

	// This is the data schema we need to obtain
	let schema = {
		dimension: 'value',
		keyProps: ['value'],
		dependency: [
			{
				dimension: 'regions',
				keyProps: ['region'],
			},
			{
				dimension: 'date',
				keyProps: ['year', 'month']
			},
			{
				dimension: 'products',
				keyProps: ['product'],
				dependency: [
					{
						dimension: 'categories',
						keyProps: ['category']
					}
				]
			}
		]
	}

	// We send it all to the constructor
	let cube = new Cube(facts, schema);

	let expected = {
		space: {
			regions: [
				{ id: 1, region: 'North' },
				{ id: 2, region: 'South' },
				{ id: 3, region: 'West' }
			],
			date: [
				{ id: 1, year: 2017, month: 'January' },
				{ id: 2, year: 2017, month: 'April' },
				{ id: 3, year: 2018, month: 'April' }
			],
			products: [
				{ id: 1, product: 'Product 1' },
				{ id: 2, product: 'Product 2' },
				{ id: 3, product: 'Product 3' },
				{ id: 4, product: 'Product 1' },
			],
			categories: [
				{ id: 1, category: 'Category 1' },
				{ id: 2, category: 'Category 2' },
			],
			value: [
				{ id: 1, value: 737 },
				{ id: 2, value: 155 },
				{ id: 3, value: 112 },
				{ id: 4, value: 319 },
			]
		},
		cellTable: [
			{ id: 1, regions_id: 1, date_id: 1, products_id: 1, categories_id: 1, value_id: 1 },
			{ id: 2, regions_id: 2, date_id: 2, products_id: 2, categories_id: 1, value_id: 2 },
			{ id: 3, regions_id: 3, date_id: 3, products_id: 3, categories_id: 2, value_id: 3 },
			{ id: 4, regions_id: 3, date_id: 3, products_id: 4, categories_id: 2, value_id: 4 },
		]
	}

	it('should pass readme example', ()=>{
		let data = jsonParseStringify(cube);
		expect(isEqual(expected, data)).toBe(true)

		// let member = { category: 'Category 1' }
		let member = { id: 1 }
		let filter = { categories: member }
		let res = cube.query('products', filter )

		expected = [
			{ id: 1, product: 'Product 1' },
			{ id: 2, product: 'Product 2' },
		]

		let isit = isEqual(expected, jsonParseStringify(res));
		expect(isit).toBe(true)
	})
});