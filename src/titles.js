'use strict';

// Imports
const _ = require('lodash');
const nested = ['bonuses', 'seasons', 'episodes'];

class Titles {
    constructor(titles) {
        this.data = titles;
    }

    add(newTitle) {
        this.data = _.union(this.data, [JSON.parse(newTitle)]);
    }

    delete(searchString) {
        const clone = [];
        _.forEach(this.data, (title) => {
            var transform = this.cloneTransform(title, searchString, () => {
                return {}
            });
            clone.push(transform)
        });
        this.data = clone;
    }

    update(searchString, update) {
        const clone = [];
        _.forEach(this.data, (title) => {
            var transform = this.cloneTransform(title, searchString, () => {
                return update
            });
            clone.push(transform)
        });
        this.data = clone;
    };

    search(searchString) {
        const results = [];
        const matches = this.findMatchingPaths(searchString, this.data);
        _.forEach(matches, (match) => {
            results.push(this.pickDeep(this.data, match))
        });
        return results;
    }


    /**
     * Return the property of obj at the given path
     *
     * @param obj
     * @param match
     * @returns {*}
     */
    pickDeep(obj, match) {
        let dot = match.indexOf('.');
        if (dot && dot > 0) {
            return this.pickDeep(obj[match.substr(0, dot)], match.substr(dot + 1, match.length))
        } else {
            return obj[match]
        }
    }

    /**
     * Returns nested paths for any title with a name matching searchstring
     *
     * @param searchString
     * @param data
     * @param path
     * @param paths
     * @returns {*|Array}
     */
    findMatchingPaths(searchString, data, path, paths) {
        path = path || '';
        paths = paths || [];
        _.forEach(data, (title, index) => {
            const currentPath = `${path ? path + '.' : ''}${index}`;
            // Push matches
            if (title.name == searchString) {
                paths.push(currentPath)
            }
            // Anything that can be nested should be recursed through
            _.forEach(nested, (property) => {
                if (title.hasOwnProperty(property)) {
                    this.findMatchingPaths(searchString, title[property], `${currentPath}.${property}`, paths)
                }
            })
        });
        return paths;
    }

    /**
     *  Deep clones an object, transforming any nested object (including itself or nested in an array)
     *  that matches searchString
     * @param obj
     * @param searchString
     * @param fn
     * @returns {*}
     */

    cloneTransform(obj, searchString, fn) {
        let clone = {};
        if (obj.hasOwnProperty('name') && obj.name !== searchString) {
            // The title didn't match, so we have to filter all sub-results
            _.forOwn(obj, (property, name) => {
                if (_.isArray(property)) {
                    clone[name] = _.map(property, (sub) => {
                        var cloneTransform2 = this.cloneTransform(sub, searchString, fn);
                        return cloneTransform2
                    })
                }
                else {
                    clone[name] = property
                }
            });
            return clone;
        } else {
            return fn(obj)
        }
    }

}


module.exports = {Titles};