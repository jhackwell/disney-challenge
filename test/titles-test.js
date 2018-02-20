'use strict';

// Imports
const assert = require('chai').assert;
const Titles = require('../src/titles').Titles;
const _ = require('lodash');

// Configuration
let titles;

describe('Titles', function () {
    beforeEach(() => {
        titles = new Titles(require('../data/titles.json'));
    });
    describe('Search', () => {
        it('Should return title for top-level matches', () => {
            const res = titles.search('Frozen');
            assert.equal(res.length, 1);
            assert(res[0].name === 'Frozen');
        });
        it('Should return title for nested matches', () => {
            const res = titles.search('...In Translation');
            assert.equal(res.length, 1);
            assert(res[0].name === '...In Translation');
        });
        it('Should return empty array for unmatched search', () => {
            const res = titles.search('Foo');
            assert.equal(res.length, 0);
        });
    });
    describe('Add', () => {
        it('Should add a new title to the titles', () => {
            assert.equal(titles.data.length, 5);
            titles.add('{"name": "foo"}', titles);
            assert.equal(titles.data.length, 6);
            assert.equal(_.last(titles.data).name, "foo");
        });
        it('Should track state between add invocations', () => {
            assert.equal(titles.data.length, 5);
            titles.add('{"name": "foo"}', titles);
            assert.equal(titles.data.length, 6);
            titles.add('{"name": "bar"}', titles);
            assert.equal(titles.data.length, 7);
        });
    });
    describe('Delete', () => {
        // Todo add note about leaving blank thing
        // Note: this couples the deletion test to the search functionality
        it('Should remove the title from the data set', () => {
            assert.equal(titles.search('Frozen').length, 1);
            titles.delete('Frozen');
            assert.equal(titles.search('Frozen').length, 0);
        });
        it('Should remove nested titles', () => {
            assert.equal(titles.search('...And Found').length, 1);
            titles.delete('...And Found');
            assert.equal(titles.search('... And Found').length, 0);
        });
    });
    describe('Update', () => {
        // Todo add note about leaving blank thing
        // Note: this couples the deletion test to the search functionality
        it('Should update the title', () => {
            assert.equal(titles.search('Frozen 2').length, 0);
            titles.update('Frozen', {name: "Frozen 2"});
            assert.equal(titles.search('Frozen 2').length, 1);
        });
        it('Should update the title', () => {
            assert.equal(titles.search('...And Lost Again').length, 0);
            assert.equal(titles.search('...And Found').length, 1);
            titles.update('...And Found', {name: "...And Lost Again"});
            assert.equal(titles.search('...And Found').length, 0);
            assert.equal(titles.search('...And Lost Again').length, 1);

        });
    })
});
