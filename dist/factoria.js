'use strict';

var faker = require('@faker-js/faker');

var isMergeableObject = function isMergeableObject(value) {
	return isNonNullObject(value)
		&& !isSpecial(value)
};

function isNonNullObject(value) {
	return !!value && typeof value === 'object'
}

function isSpecial(value) {
	var stringValue = Object.prototype.toString.call(value);

	return stringValue === '[object RegExp]'
		|| stringValue === '[object Date]'
		|| isReactElement(value)
}

// see https://github.com/facebook/react/blob/b5ac963fb791d1298e7f396236383bc955f916c1/src/isomorphic/classic/element/ReactElement.js#L21-L25
var canUseSymbol = typeof Symbol === 'function' && Symbol.for;
var REACT_ELEMENT_TYPE = canUseSymbol ? Symbol.for('react.element') : 0xeac7;

function isReactElement(value) {
	return value.$$typeof === REACT_ELEMENT_TYPE
}

function emptyTarget(val) {
	return Array.isArray(val) ? [] : {}
}

function cloneUnlessOtherwiseSpecified(value, options) {
	return (options.clone !== false && options.isMergeableObject(value))
		? deepmerge(emptyTarget(value), value, options)
		: value
}

function defaultArrayMerge(target, source, options) {
	return target.concat(source).map(function(element) {
		return cloneUnlessOtherwiseSpecified(element, options)
	})
}

function getMergeFunction(key, options) {
	if (!options.customMerge) {
		return deepmerge
	}
	var customMerge = options.customMerge(key);
	return typeof customMerge === 'function' ? customMerge : deepmerge
}

function getEnumerableOwnPropertySymbols(target) {
	return Object.getOwnPropertySymbols
		? Object.getOwnPropertySymbols(target).filter(function(symbol) {
			return target.propertyIsEnumerable(symbol)
		})
		: []
}

function getKeys(target) {
	return Object.keys(target).concat(getEnumerableOwnPropertySymbols(target))
}

function propertyIsOnObject(object, property) {
	try {
		return property in object
	} catch(_) {
		return false
	}
}

// Protects from prototype poisoning and unexpected merging up the prototype chain.
function propertyIsUnsafe(target, key) {
	return propertyIsOnObject(target, key) // Properties are safe to merge if they don't exist in the target yet,
		&& !(Object.hasOwnProperty.call(target, key) // unsafe if they exist up the prototype chain,
			&& Object.propertyIsEnumerable.call(target, key)) // and also unsafe if they're nonenumerable.
}

function mergeObject(target, source, options) {
	var destination = {};
	if (options.isMergeableObject(target)) {
		getKeys(target).forEach(function(key) {
			destination[key] = cloneUnlessOtherwiseSpecified(target[key], options);
		});
	}
	getKeys(source).forEach(function(key) {
		if (propertyIsUnsafe(target, key)) {
			return
		}

		if (propertyIsOnObject(target, key) && options.isMergeableObject(source[key])) {
			destination[key] = getMergeFunction(key, options)(target[key], source[key], options);
		} else {
			destination[key] = cloneUnlessOtherwiseSpecified(source[key], options);
		}
	});
	return destination
}

function deepmerge(target, source, options) {
	options = options || {};
	options.arrayMerge = options.arrayMerge || defaultArrayMerge;
	options.isMergeableObject = options.isMergeableObject || isMergeableObject;
	// cloneUnlessOtherwiseSpecified is added to `options` so that custom arrayMerge()
	// implementations can use it. The caller may not replace it.
	options.cloneUnlessOtherwiseSpecified = cloneUnlessOtherwiseSpecified;

	var sourceIsArray = Array.isArray(source);
	var targetIsArray = Array.isArray(target);
	var sourceAndTargetTypesMatch = sourceIsArray === targetIsArray;

	if (!sourceAndTargetTypesMatch) {
		return cloneUnlessOtherwiseSpecified(source, options)
	} else if (sourceIsArray) {
		return options.arrayMerge(target, source, options)
	} else {
		return mergeObject(target, source, options)
	}
}

deepmerge.all = function deepmergeAll(array, options) {
	if (!Array.isArray(array)) {
		throw new Error('first argument should be an array')
	}

	return array.reduce(function(prev, next) {
		return deepmerge(prev, next, options)
	}, {})
};

var deepmerge_1 = deepmerge;

var cjs = deepmerge_1;

var _this = this;
var definitions = {};
var isDictionary = function (thingy) { return Object.prototype.toString.call(thingy) === '[object Object]'; };
var appliedStates = [];
var resolveOverrides = function (overrides) {
    var props = Object.assign({}, overrides);
    for (var key in props) {
        if (!Object.prototype.hasOwnProperty.call(props, key)) {
            continue;
        }
        if (props[key] instanceof Function) {
            props[key] = props[key].call(_this, faker.faker);
        }
        else if (isDictionary(props[key])) {
            props[key] = resolveOverrides(props[key]);
        }
    }
    return props;
};
var generate = function (name, overrides, states) {
    if (overrides === void 0) { overrides = {}; }
    // back up the global applied states so that they won't tamper the recursive calls to sub-models (if any)
    var statesBackup = appliedStates;
    appliedStates = [];
    var stateAttributes = {};
    states.forEach(function (state) {
        if (!Object.prototype.hasOwnProperty.call(definitions[name].states, state)) {
            throw new Error("Model \"" + name + "\" has no \"" + state + "\" state.");
        }
        var stateDescriptor = definitions[name].states[state];
        stateAttributes = cjs(stateAttributes, stateDescriptor instanceof Function ? stateDescriptor.call(_this, faker.faker) : stateDescriptor);
    });
    var result = cjs.all([
        definitions[name].attributes(faker.faker),
        stateAttributes,
        resolveOverrides(overrides)
    ]);
    appliedStates = statesBackup;
    return result;
};
// @ts-ignore
var factory = function (name, count, overrides) {
    if (count === void 0) { count = 1; }
    if (overrides === void 0) { overrides = {}; }
    if (!Object.prototype.hasOwnProperty.call(definitions, name)) {
        throw new Error("Model \"" + name + "\" not found.");
    }
    if (typeof count !== 'number') {
        return factory(name, 1, count);
    }
    var generated = count === 1
        ? generate(name, overrides, appliedStates)
        : Array.from(Array(count)).map(function () { return generate(name, overrides, appliedStates); });
    // Reset the currently applied states so that the next factory() call won't be tampered
    appliedStates = [];
    return generated;
};
factory.states = function () {
    var states = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        states[_i] = arguments[_i];
    }
    appliedStates = states;
    return factory;
};
factory.define = function (name, attributes, states) {
    if (states === void 0) { states = {}; }
    definitions[name] = { attributes: attributes, states: states };
    return factory;
};

module.exports = factory;
