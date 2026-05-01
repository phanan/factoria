import { faker } from "@faker-js/faker";
const definitions = {};
var l = {};
function s(e) {
  return T(e);
}
function T(e) {
  return e instanceof Map;
}
function u(e) {
  return j(e);
}
function j(e) {
  return e instanceof Set;
}
function o(e) {
  return !!e && e.constructor === Object;
}
function b(e) {
  return Object.keys(e);
}
function M(e, y, ...f) {
  let i = l;
  for (let c of [e, y, ...f]) {
    if (!o(c)) throw new TypeError("Expected all arguments to be object literals.");
    let r = { ...i }, p = b(c);
    for (let a of p) {
      let n = r[a], t = c[a];
      if (n !== t) {
        if (o(n) && o(t)) {
          r[a] = M(n, t);
          continue;
        }
        if (Array.isArray(n) && Array.isArray(t)) {
          r[a] = [.../* @__PURE__ */ new Set([...n, ...t])];
          continue;
        }
        if (s(n) && s(t)) {
          r[a] = new Map([...n, ...t]);
          continue;
        }
        if (u(n) && u(t)) {
          r[a] = /* @__PURE__ */ new Set([...n, ...t]);
          continue;
        }
        r[a] = t;
      }
    }
    i = r;
  }
  return i;
}
const isDictionary = (thingy) => Object.prototype.toString.call(thingy) === "[object Object]";
function assertCount(value) {
  if (typeof value !== "number" || !Number.isInteger(value) || value < 1) {
    throw new Error("factoria: count must be a positive integer.");
  }
}
const resolveAttributes = (attrs) => {
  if (attrs instanceof Function) {
    attrs = attrs(faker);
  }
  const props = Object.assign({}, attrs);
  for (const key in props) {
    if (!Object.prototype.hasOwnProperty.call(props, key)) {
      continue;
    }
    if (props[key] instanceof Builder) {
      props[key] = props[key].make();
    } else if (props[key] instanceof Function) {
      props[key] = props[key].call(void 0, faker);
    } else if (isDictionary(props[key])) {
      props[key] = resolveAttributes(props[key]);
    }
  }
  return props;
};
const generate = (name, overrides, states) => {
  let stateAttributes = {};
  states.forEach((state) => {
    if (!Object.prototype.hasOwnProperty.call(definitions[name].states, state)) {
      throw new Error(`factoria: Model "${name}" has no "${state}" state.`);
    }
    const stateDescriptor = definitions[name].states[state];
    stateAttributes = M(
      stateAttributes,
      stateDescriptor instanceof Function ? stateDescriptor.call(void 0, faker) : stateDescriptor
    );
  });
  return M(
    resolveAttributes(definitions[name].attributes(faker)),
    resolveAttributes(stateAttributes),
    resolveAttributes(overrides)
  );
};
class Builder {
  constructor(name) {
    this.name = name;
    this.appliedStates = [];
    if (!Object.prototype.hasOwnProperty.call(definitions, name)) {
      throw new Error(`factoria: Model "${name}" not found.`);
    }
  }
  state(...names) {
    this.appliedStates.push(...names);
    return this;
  }
  count(n) {
    assertCount(n);
    this.requestedCount = n;
    return this;
  }
  make(overridesOrCount, count) {
    let overrides = {};
    let n = this.requestedCount || 1;
    if (typeof overridesOrCount === "number" && count !== void 0) {
      throw new Error("factoria: make(): count cannot be passed twice.");
    }
    const countPassedToMake = typeof overridesOrCount === "number" || count !== void 0;
    if (this.requestedCount !== void 0 && countPassedToMake) {
      console.warn(`factoria: count was already set to ${this.requestedCount} via .count(); the count passed to make() will override it.`);
    }
    if (typeof overridesOrCount === "number") {
      assertCount(overridesOrCount);
      n = overridesOrCount;
    } else if (overridesOrCount !== void 0) {
      if (!isDictionary(overridesOrCount) && typeof overridesOrCount !== "function") {
        throw new Error("factoria: make(): overrides must be an object or a function.");
      }
      overrides = overridesOrCount;
    }
    if (count !== void 0) {
      assertCount(count);
      n = count;
    }
    if (n === 1) {
      return generate(this.name, overrides, this.appliedStates);
    }
    return Array.from(
      { length: n },
      () => generate(this.name, overrides, this.appliedStates)
    );
  }
}
const factory = (name) => new Builder(name);
factory.define = (name, attributes, states = {}) => {
  definitions[name] = { attributes, states };
  return factory;
};
factory.seed = (value) => {
  faker.seed(value);
  return factory;
};
export {
  factory as default
};
