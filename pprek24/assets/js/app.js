function innerWidth(element) {
    const outerWidth = element.clientWidth;
    const styles = getComputedStyle(element);
    const borderInline = [styles.borderInlineStartWidth, styles.borderInlineEndWidth]
        .reduce((prev, cur) => prev + parseFloat(cur), 0);
    const paddingInline = [styles.paddingInlineStart, styles.paddingInlineEnd]
        .reduce((prev, cur) => prev + parseFloat(cur), 0);
    return outerWidth - borderInline - paddingInline;
}
function em(element, value) {
    const em1 = parseFloat(getComputedStyle(element).fontSize);
    return value * em1;
}
function rem(value) {
    return em(document.documentElement, value);
}

var AriaAttributes;
(function (AriaAttributes) {
    AriaAttributes["ARIA_CONTROLS"] = "aria-controls";
    AriaAttributes["ARIA_EXPANDED"] = "aria-expanded";
    AriaAttributes["ARIA_HASPOPUP"] = "aria-haspopup";
})(AriaAttributes || (AriaAttributes = {}));
function toggleExpanded(element) {
    const current = element.getAttribute(AriaAttributes.ARIA_EXPANDED) === 'true';
    const newValue = !current;
    element.setAttribute(AriaAttributes.ARIA_EXPANDED, newValue.toString());
    return newValue;
}
function setExpanded(element, value) {
    element.setAttribute(AriaAttributes.ARIA_EXPANDED, value.toString());
}

/**
 * Returns the owner document of a given element.
 * 
 * @param node the element
 */
function ownerDocument(node) {
  return node && node.ownerDocument || document;
}

var canUseDOM = !!(typeof window !== 'undefined' && window.document && window.document.createElement);

/* eslint-disable no-return-assign */
var optionsSupported = false;
var onceSupported = false;

try {
  var options = {
    get passive() {
      return optionsSupported = true;
    },

    get once() {
      // eslint-disable-next-line no-multi-assign
      return onceSupported = optionsSupported = true;
    }

  };

  if (canUseDOM) {
    window.addEventListener('test', options, options);
    window.removeEventListener('test', options, true);
  }
} catch (e) {
  /* */
}

/* https://github.com/component/raf */
var prev = new Date().getTime();

function fallback(fn) {
  var curr = new Date().getTime();
  var ms = Math.max(0, 16 - (curr - prev));
  var handle = setTimeout(fn, ms);
  prev = curr;
  return handle;
}

var vendors = ['', 'webkit', 'moz', 'o', 'ms'];
var rafImpl = fallback; // eslint-disable-next-line import/no-mutable-exports

var getKey = function getKey(vendor, k) {
  return vendor + (!vendor ? k : k[0].toUpperCase() + k.substr(1)) + "AnimationFrame";
};

if (canUseDOM) {
  vendors.some(function (vendor) {
    var rafMethod = getKey(vendor, 'request');

    if (rafMethod in window) {
      getKey(vendor, 'cancel'); // @ts-ignore

      rafImpl = function rafImpl(cb) {
        return window[rafMethod](cb);
      };
    }

    return !!rafImpl;
  });
}

Function.prototype.bind.call(Function.prototype.call, [].slice);

Function.prototype.bind.call(Function.prototype.call, [].slice);

function handleOutsideClick(element, eventHandler) {
    const doc = ownerDocument(element);
    doc.addEventListener('click', eventHandler, true);
    return () => removeEventListener('click', eventHandler);
}

class SiteNav {
    headerPadding;
    header = document.querySelector('body > .site-header');
    siteTitle = document.querySelector('body > .site-header > .site-title');
    toggle = document.querySelector('body > .site-header > .site-nav-toggle');
    nav = document.querySelector('body > .site-header > .site-nav');
    list = document.querySelector('body > .site-header > .site-nav > ul');
    structure = this.getStructure();
    navWidth = this.nav.clientWidth;
    #mobile = false;
    #indices = [];
    constructor(headerPadding = rem(4)) {
        this.headerPadding = headerPadding;
        window.addEventListener('resize', this.navWatcher());
        this.toggle.addEventListener('click', () => {
            const state = this.toggleOpen();
            if (state) {
                this.structure[0].element.focus();
            }
        });
        this.addClickListeners();
        this.list.addEventListener('keydown', this.keyboardListener.bind(this));
    }
    get mobile() {
        return this.#mobile;
    }
    set mobile(value) {
        if (value !== this.#mobile) {
            this.#mobile = value;
            document.body.setAttribute('data-mobile-nav', value.toString());
            for (const elem of this.firstLevelElements()) {
                if (value) {
                    elem.setAttribute('tabindex', '-1');
                }
                else {
                    elem.removeAttribute('tabindex');
                }
            }
        }
    }
    get open() {
        return this.#indices.length > 0;
    }
    set open(value) {
        if (value !== this.open) {
            this.#indices = [0];
            setExpanded(this.toggle, value);
            if (!value) {
                let current = this.current;
                while (current != null) {
                    setExpanded(current.toggle, false);
                    this.#indices.pop();
                    current = this.current;
                }
            }
        }
    }
    get closed() {
        return !this.open;
    }
    set closed(value) {
        if (value === this.open) {
            setExpanded(this.toggle, !value);
            if (value) {
                let current = this.current;
                while (current != null) {
                    setExpanded(current.toggle, false);
                    this.#indices.pop();
                    current = this.current;
                }
            }
        }
    }
    get indices() {
        return [...this.#indices];
    }
    get current() {
        if (this.#indices.length === 0) {
            return undefined;
        }
        let structure = this.structure;
        const idx = this.indices;
        const lastIndex = idx.pop();
        while (idx.length > 0) {
            structure = structure[idx.shift()].items;
        }
        return structure[lastIndex];
    }
    toggleOpen() {
        this.open = this.closed;
        return this.open;
    }
    navWatcher() {
        const headerWidth = innerWidth(this.header);
        const titleWidth = this.siteTitle.clientWidth;
        const delta = headerWidth - titleWidth - this.headerPadding;
        this.mobile = this.navWidth > delta;
        return this.navWatcher.bind(this);
    }
    addClickListeners(structure = this.structure, index = []) {
        for (let idx = 0, item = structure[0]; idx < structure.length; item = structure[++idx]) {
            if (item.type === 'item') {
                continue;
            }
            item.element.addEventListener('click', () => {
                const state = toggleExpanded(item.element);
                if (state) {
                    const current = this.current;
                    if (this.#indices.length > 1 && current != null) {
                        setExpanded(current.toggle, false);
                    }
                    item.items[0].element.focus();
                    this.#indices = [...index, idx, 0];
                }
                else {
                    item.element.focus();
                    this.#indices = [...index, idx];
                }
            });
            this.addClickListeners(item.items, [...index, idx]);
        }
        handleOutsideClick(this.list, event => {
            if (this.closed) {
                return;
            }
            let node = event.target;
            while (node != null && node.nodeType !== Node.DOCUMENT_NODE) {
                if (node === this.list || node === this.toggle) {
                    return;
                }
                node = node.parentElement;
            }
            this.closed = true;
        });
    }
    keyboardListener(event) {
        if (this.indices.length === 0) {
            this.setIndicesByElement(event.target);
        }
        if (event.key === 'Tab' && !event.shiftKey) {
            if (this.indices.length === 1) {
                if (this.mobile) {
                    event.preventDefault();
                    this.incrementIndex();
                    this.current?.element?.focus();
                }
                else {
                    if (this.indices[0] === this.structure.length - 1) {
                        this.closed = true;
                    }
                    else {
                        this.incrementIndex(false);
                    }
                }
            }
            else {
                event.preventDefault();
                this.incrementIndex();
                this.current?.element?.focus();
            }
        }
        else if (event.key === 'Tab' && event.shiftKey) {
            if (this.indices.length === 1) {
                if (this.mobile) {
                    event.preventDefault();
                    this.decrementIndex();
                    this.current?.element?.focus();
                }
                else {
                    if (this.indices[0] === 0) {
                        this.closed = true;
                    }
                    else {
                        this.decrementIndex(false);
                    }
                }
            }
            else {
                event.preventDefault();
                this.decrementIndex();
                this.current?.element?.focus();
            }
        }
        else if (event.key === 'Enter' || event.code === 'Space') {
            if (this.current?.type === 'toggle') {
                event.preventDefault();
                setExpanded(this.current.element, true);
                this.current.items[0].element.focus();
                this.#indices.push(0);
            }
        }
        else if (event.key === 'Escape') {
            if (!this.mobile && this.#indices.length === 1) {
                return;
            }
            setExpanded(this.current?.toggle, false);
            this.current?.toggle?.focus();
            this.#indices.pop();
        }
        else if (event.key === 'ArrowUp') {
            if (!this.mobile && this.#indices.length === 1) {
                return;
            }
            event.preventDefault();
            this.decrementIndex();
            this.current?.element?.focus();
        }
        else if (event.key === 'ArrowDown') {
            if (!this.mobile && this.#indices.length === 1) {
                if (this.current?.type === 'toggle') {
                    event.preventDefault();
                    setExpanded(this.current.element, true);
                    this.current.items[0].element.focus();
                    this.#indices.push(0);
                }
                return;
            }
            event.preventDefault();
            this.incrementIndex();
            this.current?.element?.focus();
        }
        else if (event.key === 'ArrowRight') {
            event.preventDefault();
            if (this.current?.type !== 'toggle') {
                return;
            }
            else if (!this.mobile && this.indices.length === 1) {
                this.incrementIndex();
                this.current?.element?.focus();
                return;
            }
            setExpanded(this.current.element, true);
            this.current.items[0].element.focus();
            this.#indices.push(0);
        }
        else if (event.key === 'ArrowLeft') {
            event.preventDefault();
            if (!this.mobile && this.indices.length === 1) {
                this.decrementIndex();
                this.current?.element?.focus();
                return;
            }
            setExpanded(this.current?.toggle, false);
            this.current?.toggle?.focus();
            this.#indices.pop();
        }
    }
    incrementIndex(overflow = true) {
        if (overflow) {
            let structure = this.structure;
            const idx = this.indices.slice(0, -1);
            while (idx.length > 0) {
                structure = structure[idx.shift()].items;
            }
            this.#indices[this.#indices.length - 1] = (this.#indices[this.#indices.length - 1] + structure.length + 1) % structure.length;
        }
        else {
            this.#indices[this.#indices.length - 1]++;
        }
    }
    decrementIndex(overflow = true) {
        if (overflow) {
            let structure = this.structure;
            const idx = this.indices.slice(0, -1);
            while (idx.length > 0) {
                structure = structure[idx.shift()].items;
            }
            this.#indices[this.#indices.length - 1] = (this.#indices[this.#indices.length - 1] + structure.length - 1) % structure.length;
        }
        else {
            this.#indices[this.#indices.length - 1]--;
        }
    }
    setIndicesByElement(element, structure = this.structure, index = []) {
        for (let idx = 0, item = structure[0]; idx < structure.length; item = structure[++idx]) {
            if (item.element === element) {
                this.#indices = [...index, idx];
                return true;
            }
            if (item.type === 'toggle') {
                if (this.setIndicesByElement(item.element, item.items, [...index, idx])) {
                    return true;
                }
            }
        }
        return false;
    }
    *firstLevelElements(list = this.list) {
        for (const child of Array.from(list.children)) {
            for (const grandchild of Array.from(child.children)) {
                if (grandchild instanceof HTMLAnchorElement || grandchild instanceof HTMLButtonElement) {
                    yield grandchild;
                }
            }
        }
    }
    getStructure(list = this.list, toggle = this.toggle) {
        const structure = [];
        for (const item of this.firstLevelElements(list)) {
            const hasPopup = item.getAttribute(AriaAttributes.ARIA_EXPANDED) != null;
            if (hasPopup) {
                const controls = item.getAttribute(AriaAttributes.ARIA_CONTROLS);
                if (controls == null) {
                    throw new ReferenceError(`${AriaAttributes.ARIA_CONTROLS} unset`);
                }
                const subMenu = list.querySelector(`#${controls}`);
                if (subMenu == null) {
                    throw new ReferenceError(`${AriaAttributes.ARIA_CONTROLS} "${controls}" invalid`);
                }
                structure.push({
                    type: 'toggle',
                    element: item,
                    list: subMenu,
                    toggle,
                    items: this.getStructure(subMenu, item)
                });
            }
            else {
                structure.push({
                    type: 'item',
                    element: item,
                    list,
                    toggle
                });
            }
        }
        return Object.freeze(structure);
    }
}

function useIfExists(it, callback, defaultValue = null) {
    if (it == null) {
        return defaultValue;
    }
    return callback(it);
}
function useIf(it, predicate, callback, defaultValue = null) {
    if (predicate(it)) {
        return callback(it);
    }
    return defaultValue;
}
const config = useIfExists(document.querySelector('#pprek_js_conf'), it => JSON.parse(it.textContent ?? '{}'), {});
const dateFormatters = {
    twoDigitDayFormatter: new Intl.DateTimeFormat(undefined, { day: '2-digit' }),
    shortMonthFormatter: new Intl.DateTimeFormat(undefined, { month: 'short' }),
    shortTimeFormatter: new Intl.DateTimeFormat(undefined, { hour12: false, timeStyle: 'short' }),
    longDateFormatter: new Intl.DateTimeFormat(undefined, { dateStyle: 'long' }),
    longMonthFormatter: new Intl.DateTimeFormat(undefined, { month: 'long', year: 'numeric' }),
    shortWeekDayFormatter: new Intl.DateTimeFormat(undefined, { weekday: 'short' }),
    longWeekDayFormatter: new Intl.DateTimeFormat(undefined, { weekday: 'long' })
};
const randomCharPool = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
function getRandomId(length = 6, prefix = '', postfix = '', attempt = 0) {
    if (attempt == 100) {
        throw new Error('Unable to create random id');
    }
    let str = prefix;
    for (let i = 0; i < Math.max(1, Math.floor(length)); i++) {
        const char = randomCharPool[Math.round(Math.random() * randomCharPool.length)];
        str += char;
    }
    str += postfix;
    return (document.getElementById(str) != null)
        ? getRandomId(length, prefix, postfix, ++attempt)
        : str;
}
function eventAffectsDate(event, date) {
    const start = new Date(event.start);
    const end = new Date(event.end);
    const startInt = start.getFullYear() * 10000 + (start.getMonth() + 1) * 100 + start.getDate();
    const endInt = end.getFullYear() * 10000 + (end.getMonth() + 1) * 100 + end.getDate();
    const int = date.getFullYear() * 10000 + (date.getMonth() + 1) * 100 + date.getDate();
    return startInt <= int && endInt >= int;
}
function leftPad(num, length = 2, pad = '0') {
    if (pad.length !== 1) {
        throw new SyntaxError('pad must be a single character');
    }
    length = Number.parseInt(length);
    if (length <= 1) {
        length = 2;
    }
    let res = num.toString();
    while (res.length < length) {
        res = '0' + res;
    }
    return res;
}

const node_env = globalThis.process?.env?.NODE_ENV;
if (!node_env) {
	console.warn('If bundling, conditions should include development or production. If not bundling, conditions or NODE_ENV should include development or production. See https://www.npmjs.com/package/esm-env for tips on setting conditions in popular bundlers and runtimes.');
}

var DEV = node_env && !node_env.toLowerCase().includes('prod');

// Store the references to globals in case someone tries to monkey patch these, causing the below
// to de-opt (this occurs often when using popular extensions).
var is_array = Array.isArray;
var array_from = Array.from;
var define_property = Object.defineProperty;
var get_descriptor = Object.getOwnPropertyDescriptor;
var get_descriptors = Object.getOwnPropertyDescriptors;
var object_prototype = Object.prototype;
var array_prototype = Array.prototype;
var get_prototype_of = Object.getPrototypeOf;

const noop = () => {};

// Adapted from https://github.com/then/is-promise/blob/master/index.js
// Distributed under MIT License https://github.com/then/is-promise/blob/master/LICENSE

/**
 * @template [T=any]
 * @param {any} value
 * @returns {value is PromiseLike<T>}
 */
function is_promise(value) {
	return typeof value?.then === 'function';
}

/** @param {Array<() => void>} arr */
function run_all(arr) {
	for (var i = 0; i < arr.length; i++) {
		arr[i]();
	}
}

const DERIVED = 1 << 1;
const EFFECT = 1 << 2;
const RENDER_EFFECT = 1 << 3;
const BLOCK_EFFECT = 1 << 4;
const BRANCH_EFFECT = 1 << 5;
const ROOT_EFFECT = 1 << 6;
const BOUNDARY_EFFECT = 1 << 7;
const UNOWNED = 1 << 8;
const DISCONNECTED = 1 << 9;
const CLEAN = 1 << 10;
const DIRTY = 1 << 11;
const MAYBE_DIRTY = 1 << 12;
const INERT = 1 << 13;
const DESTROYED = 1 << 14;
const EFFECT_RAN = 1 << 15;
/** 'Transparent' effects do not create a transition boundary */
const EFFECT_TRANSPARENT = 1 << 16;
/** Svelte 4 legacy mode props need to be handled with deriveds and be recognized elsewhere, hence the dedicated flag */
const LEGACY_DERIVED_PROP = 1 << 17;
const INSPECT_EFFECT = 1 << 18;
const HEAD_EFFECT = 1 << 19;
const EFFECT_HAS_DERIVED = 1 << 20;

const STATE_SYMBOL = Symbol('$state');
const STATE_SYMBOL_METADATA = Symbol('$state metadata');
const LEGACY_PROPS = Symbol('legacy props');
const LOADING_ATTR_SYMBOL = Symbol('');

/** @import { Equals } from '#client' */
/** @type {Equals} */
function equals$1(value) {
	return value === this.v;
}

/**
 * @param {unknown} a
 * @param {unknown} b
 * @returns {boolean}
 */
function safe_not_equal(a, b) {
	return a != a
		? b == b
		: a !== b || (a !== null && typeof a === 'object') || typeof a === 'function';
}

/** @type {Equals} */
function safe_equals(value) {
	return !safe_not_equal(value, this.v);
}

/* This file is generated by scripts/process-messages/index.js. Do not edit! */


/**
 * Component %component% has an export named `%key%` that a consumer component is trying to access using `bind:%key%`, which is disallowed. Instead, use `bind:this` (e.g. `<%name% bind:this={component} />`) and then access the property on the bound component instance (e.g. `component.%key%`)
 * @param {string} component
 * @param {string} key
 * @param {string} name
 * @returns {never}
 */
function bind_invalid_export(component, key, name) {
	if (DEV) {
		const error = new Error(`bind_invalid_export\nComponent ${component} has an export named \`${key}\` that a consumer component is trying to access using \`bind:${key}\`, which is disallowed. Instead, use \`bind:this\` (e.g. \`<${name} bind:this={component} />\`) and then access the property on the bound component instance (e.g. \`component.${key}\`)\nhttps://svelte.dev/e/bind_invalid_export`);

		error.name = 'Svelte error';
		throw error;
	} else {
		throw new Error(`https://svelte.dev/e/bind_invalid_export`);
	}
}

/**
 * A component is attempting to bind to a non-bindable property `%key%` belonging to %component% (i.e. `<%name% bind:%key%={...}>`). To mark a property as bindable: `let { %key% = $bindable() } = $props()`
 * @param {string} key
 * @param {string} component
 * @param {string} name
 * @returns {never}
 */
function bind_not_bindable(key, component, name) {
	if (DEV) {
		const error = new Error(`bind_not_bindable\nA component is attempting to bind to a non-bindable property \`${key}\` belonging to ${component} (i.e. \`<${name} bind:${key}={...}>\`). To mark a property as bindable: \`let { ${key} = $bindable() } = $props()\`\nhttps://svelte.dev/e/bind_not_bindable`);

		error.name = 'Svelte error';
		throw error;
	} else {
		throw new Error(`https://svelte.dev/e/bind_not_bindable`);
	}
}

/**
 * %parent% called `%method%` on an instance of %component%, which is no longer valid in Svelte 5. See https://svelte.dev/docs/svelte/v5-migration-guide#Components-are-no-longer-classes for more information
 * @param {string} parent
 * @param {string} method
 * @param {string} component
 * @returns {never}
 */
function component_api_changed(parent, method, component) {
	if (DEV) {
		const error = new Error(`component_api_changed\n${parent} called \`${method}\` on an instance of ${component}, which is no longer valid in Svelte 5. See https://svelte.dev/docs/svelte/v5-migration-guide#Components-are-no-longer-classes for more information\nhttps://svelte.dev/e/component_api_changed`);

		error.name = 'Svelte error';
		throw error;
	} else {
		throw new Error(`https://svelte.dev/e/component_api_changed`);
	}
}

/**
 * Attempted to instantiate %component% with `new %name%`, which is no longer valid in Svelte 5. If this component is not under your control, set the `compatibility.componentApi` compiler option to `4` to keep it working. See https://svelte.dev/docs/svelte/v5-migration-guide#Components-are-no-longer-classes for more information
 * @param {string} component
 * @param {string} name
 * @returns {never}
 */
function component_api_invalid_new(component, name) {
	if (DEV) {
		const error = new Error(`component_api_invalid_new\nAttempted to instantiate ${component} with \`new ${name}\`, which is no longer valid in Svelte 5. If this component is not under your control, set the \`compatibility.componentApi\` compiler option to \`4\` to keep it working. See https://svelte.dev/docs/svelte/v5-migration-guide#Components-are-no-longer-classes for more information\nhttps://svelte.dev/e/component_api_invalid_new`);

		error.name = 'Svelte error';
		throw error;
	} else {
		throw new Error(`https://svelte.dev/e/component_api_invalid_new`);
	}
}

/**
 * A derived value cannot reference itself recursively
 * @returns {never}
 */
function derived_references_self() {
	if (DEV) {
		const error = new Error(`derived_references_self\nA derived value cannot reference itself recursively\nhttps://svelte.dev/e/derived_references_self`);

		error.name = 'Svelte error';
		throw error;
	} else {
		throw new Error(`https://svelte.dev/e/derived_references_self`);
	}
}

/**
 * `%rune%` cannot be used inside an effect cleanup function
 * @param {string} rune
 * @returns {never}
 */
function effect_in_teardown(rune) {
	if (DEV) {
		const error = new Error(`effect_in_teardown\n\`${rune}\` cannot be used inside an effect cleanup function\nhttps://svelte.dev/e/effect_in_teardown`);

		error.name = 'Svelte error';
		throw error;
	} else {
		throw new Error(`https://svelte.dev/e/effect_in_teardown`);
	}
}

/**
 * Effect cannot be created inside a `$derived` value that was not itself created inside an effect
 * @returns {never}
 */
function effect_in_unowned_derived() {
	if (DEV) {
		const error = new Error(`effect_in_unowned_derived\nEffect cannot be created inside a \`$derived\` value that was not itself created inside an effect\nhttps://svelte.dev/e/effect_in_unowned_derived`);

		error.name = 'Svelte error';
		throw error;
	} else {
		throw new Error(`https://svelte.dev/e/effect_in_unowned_derived`);
	}
}

/**
 * `%rune%` can only be used inside an effect (e.g. during component initialisation)
 * @param {string} rune
 * @returns {never}
 */
function effect_orphan(rune) {
	if (DEV) {
		const error = new Error(`effect_orphan\n\`${rune}\` can only be used inside an effect (e.g. during component initialisation)\nhttps://svelte.dev/e/effect_orphan`);

		error.name = 'Svelte error';
		throw error;
	} else {
		throw new Error(`https://svelte.dev/e/effect_orphan`);
	}
}

/**
 * Maximum update depth exceeded. This can happen when a reactive block or effect repeatedly sets a new value. Svelte limits the number of nested updates to prevent infinite loops
 * @returns {never}
 */
function effect_update_depth_exceeded() {
	if (DEV) {
		const error = new Error(`effect_update_depth_exceeded\nMaximum update depth exceeded. This can happen when a reactive block or effect repeatedly sets a new value. Svelte limits the number of nested updates to prevent infinite loops\nhttps://svelte.dev/e/effect_update_depth_exceeded`);

		error.name = 'Svelte error';
		throw error;
	} else {
		throw new Error(`https://svelte.dev/e/effect_update_depth_exceeded`);
	}
}

/**
 * Cannot do `bind:%key%={undefined}` when `%key%` has a fallback value
 * @param {string} key
 * @returns {never}
 */
function props_invalid_value(key) {
	if (DEV) {
		const error = new Error(`props_invalid_value\nCannot do \`bind:${key}={undefined}\` when \`${key}\` has a fallback value\nhttps://svelte.dev/e/props_invalid_value`);

		error.name = 'Svelte error';
		throw error;
	} else {
		throw new Error(`https://svelte.dev/e/props_invalid_value`);
	}
}

/**
 * Rest element properties of `$props()` such as `%property%` are readonly
 * @param {string} property
 * @returns {never}
 */
function props_rest_readonly(property) {
	if (DEV) {
		const error = new Error(`props_rest_readonly\nRest element properties of \`$props()\` such as \`${property}\` are readonly\nhttps://svelte.dev/e/props_rest_readonly`);

		error.name = 'Svelte error';
		throw error;
	} else {
		throw new Error(`https://svelte.dev/e/props_rest_readonly`);
	}
}

/**
 * The `%rune%` rune is only available inside `.svelte` and `.svelte.js/ts` files
 * @param {string} rune
 * @returns {never}
 */
function rune_outside_svelte(rune) {
	if (DEV) {
		const error = new Error(`rune_outside_svelte\nThe \`${rune}\` rune is only available inside \`.svelte\` and \`.svelte.js/ts\` files\nhttps://svelte.dev/e/rune_outside_svelte`);

		error.name = 'Svelte error';
		throw error;
	} else {
		throw new Error(`https://svelte.dev/e/rune_outside_svelte`);
	}
}

/**
 * Property descriptors defined on `$state` objects must contain `value` and always be `enumerable`, `configurable` and `writable`.
 * @returns {never}
 */
function state_descriptors_fixed() {
	if (DEV) {
		const error = new Error(`state_descriptors_fixed\nProperty descriptors defined on \`$state\` objects must contain \`value\` and always be \`enumerable\`, \`configurable\` and \`writable\`.\nhttps://svelte.dev/e/state_descriptors_fixed`);

		error.name = 'Svelte error';
		throw error;
	} else {
		throw new Error(`https://svelte.dev/e/state_descriptors_fixed`);
	}
}

/**
 * Cannot set prototype of `$state` object
 * @returns {never}
 */
function state_prototype_fixed() {
	if (DEV) {
		const error = new Error(`state_prototype_fixed\nCannot set prototype of \`$state\` object\nhttps://svelte.dev/e/state_prototype_fixed`);

		error.name = 'Svelte error';
		throw error;
	} else {
		throw new Error(`https://svelte.dev/e/state_prototype_fixed`);
	}
}

/**
 * Reading state that was created inside the same derived is forbidden. Consider using `untrack` to read locally created state
 * @returns {never}
 */
function state_unsafe_local_read() {
	if (DEV) {
		const error = new Error(`state_unsafe_local_read\nReading state that was created inside the same derived is forbidden. Consider using \`untrack\` to read locally created state\nhttps://svelte.dev/e/state_unsafe_local_read`);

		error.name = 'Svelte error';
		throw error;
	} else {
		throw new Error(`https://svelte.dev/e/state_unsafe_local_read`);
	}
}

/**
 * Updating state inside a derived or a template expression is forbidden. If the value should not be reactive, declare it without `$state`
 * @returns {never}
 */
function state_unsafe_mutation() {
	if (DEV) {
		const error = new Error(`state_unsafe_mutation\nUpdating state inside a derived or a template expression is forbidden. If the value should not be reactive, declare it without \`$state\`\nhttps://svelte.dev/e/state_unsafe_mutation`);

		error.name = 'Svelte error';
		throw error;
	} else {
		throw new Error(`https://svelte.dev/e/state_unsafe_mutation`);
	}
}

let legacy_mode_flag = false;
let tracing_mode_flag = false;

function enable_legacy_mode_flag() {
	legacy_mode_flag = true;
}

const EACH_ITEM_REACTIVE = 1;
const EACH_INDEX_REACTIVE = 1 << 1;
const EACH_ITEM_IMMUTABLE = 1 << 4;

const PROPS_IS_IMMUTABLE = 1;
const PROPS_IS_RUNES = 1 << 1;
const PROPS_IS_BINDABLE = 1 << 3;

const TEMPLATE_FRAGMENT = 1;
const TEMPLATE_USE_IMPORT_NODE = 1 << 1;

const UNINITIALIZED = Symbol();

// Dev-time component properties
const FILENAME = Symbol('filename');

/** @import { Derived, Reaction, Signal, Value } from '#client' */

/** @type { any } */
let tracing_expressions = null;

/**
 * @param {string} label
 */
function get_stack$1(label) {
	let error = Error();
	const stack = error.stack;

	if (stack) {
		const lines = stack.split('\n');
		const new_lines = ['\n'];

		for (let i = 0; i < lines.length; i++) {
			const line = lines[i];

			if (line === 'Error') {
				continue;
			}
			if (line.includes('validate_each_keys')) {
				return null;
			}
			if (line.includes('svelte/src/internal')) {
				continue;
			}
			new_lines.push(line);
		}

		if (new_lines.length === 1) {
			return null;
		}

		define_property(error, 'stack', {
			value: new_lines.join('\n')
		});

		define_property(error, 'name', {
			// 'Error' suffix is required for stack traces to be rendered properly
			value: `${label}Error`
		});
	}
	return error;
}

/** @import { Derived, Effect, Reaction, Source, Value } from '#client' */

let inspect_effects = new Set();

/**
 * @param {Set<any>} v
 */
function set_inspect_effects(v) {
	inspect_effects = v;
}

/**
 * @template V
 * @param {V} v
 * @param {Error | null} [stack]
 * @returns {Source<V>}
 */
function source(v, stack) {
	/** @type {Value} */
	var signal = {
		f: 0, // TODO ideally we could skip this altogether, but it causes type errors
		v,
		reactions: null,
		equals: equals$1,
		version: 0
	};

	if (DEV && tracing_mode_flag) {
		signal.created = stack ?? get_stack$1('CreatedAt');
		signal.debug = null;
	}

	return signal;
}

/**
 * @template V
 * @param {V} v
 */
function state(v) {
	return push_derived_source(source(v));
}

/**
 * @template V
 * @param {V} initial_value
 * @param {boolean} [immutable]
 * @returns {Source<V>}
 */
/*#__NO_SIDE_EFFECTS__*/
function mutable_source(initial_value, immutable = false) {
	const s = source(initial_value);
	if (!immutable) {
		s.equals = safe_equals;
	}

	// bind the signal to the component context, in case we need to
	// track updates to trigger beforeUpdate/afterUpdate callbacks
	if (legacy_mode_flag && component_context !== null && component_context.l !== null) {
		(component_context.l.s ??= []).push(s);
	}

	return s;
}

/**
 * @template V
 * @param {Source<V>} source
 */
/*#__NO_SIDE_EFFECTS__*/
function push_derived_source(source) {
	if (active_reaction !== null && (active_reaction.f & DERIVED) !== 0) {
		if (derived_sources === null) {
			set_derived_sources([source]);
		} else {
			derived_sources.push(source);
		}
	}

	return source;
}

/**
 * @template V
 * @param {Source<V>} source
 * @param {V} value
 * @returns {V}
 */
function set(source, value) {
	if (
		active_reaction !== null &&
		is_runes() &&
		(active_reaction.f & (DERIVED | BLOCK_EFFECT)) !== 0 &&
		// If the source was created locally within the current derived, then
		// we allow the mutation.
		(derived_sources === null || !derived_sources.includes(source))
	) {
		state_unsafe_mutation();
	}

	return internal_set(source, value);
}

/**
 * @template V
 * @param {Source<V>} source
 * @param {V} value
 * @returns {V}
 */
function internal_set(source, value) {
	if (!source.equals(value)) {
		source.v = value;
		source.version = increment_version();

		if (DEV && tracing_mode_flag) {
			source.updated = get_stack$1('UpdatedAt');
		}

		mark_reactions(source, DIRTY);

		// If the current signal is running for the first time, it won't have any
		// reactions as we only allocate and assign the reactions after the signal
		// has fully executed. So in the case of ensuring it registers the reaction
		// properly for itself, we need to ensure the current effect actually gets
		// scheduled. i.e: `$effect(() => x++)`
		if (
			is_runes() &&
			active_effect !== null &&
			(active_effect.f & CLEAN) !== 0 &&
			(active_effect.f & BRANCH_EFFECT) === 0
		) {
			if (new_deps !== null && new_deps.includes(source)) {
				set_signal_status(active_effect, DIRTY);
				schedule_effect(active_effect);
			} else {
				if (untracked_writes === null) {
					set_untracked_writes([source]);
				} else {
					untracked_writes.push(source);
				}
			}
		}

		if (DEV && inspect_effects.size > 0) {
			const inspects = Array.from(inspect_effects);
			var previously_flushing_effect = is_flushing_effect;
			set_is_flushing_effect(true);
			try {
				for (const effect of inspects) {
					// Mark clean inspect-effects as maybe dirty and then check their dirtiness
					// instead of just updating the effects - this way we avoid overfiring.
					if ((effect.f & CLEAN) !== 0) {
						set_signal_status(effect, MAYBE_DIRTY);
					}
					if (check_dirtiness(effect)) {
						update_effect(effect);
					}
				}
			} finally {
				set_is_flushing_effect(previously_flushing_effect);
			}
			inspect_effects.clear();
		}
	}

	return value;
}

/**
 * @param {Value} signal
 * @param {number} status should be DIRTY or MAYBE_DIRTY
 * @returns {void}
 */
function mark_reactions(signal, status) {
	var reactions = signal.reactions;
	if (reactions === null) return;

	var runes = is_runes();
	var length = reactions.length;

	for (var i = 0; i < length; i++) {
		var reaction = reactions[i];
		var flags = reaction.f;

		// Skip any effects that are already dirty
		if ((flags & DIRTY) !== 0) continue;

		// In legacy mode, skip the current effect to prevent infinite loops
		if (!runes && reaction === active_effect) continue;

		// Inspect effects need to run immediately, so that the stack trace makes sense
		if (DEV && (flags & INSPECT_EFFECT) !== 0) {
			inspect_effects.add(reaction);
			continue;
		}

		set_signal_status(reaction, status);

		// If the signal a) was previously clean or b) is an unowned derived, then mark it
		if ((flags & (CLEAN | UNOWNED)) !== 0) {
			if ((flags & DERIVED) !== 0) {
				mark_reactions(/** @type {Derived} */ (reaction), MAYBE_DIRTY);
			} else {
				schedule_effect(/** @type {Effect} */ (reaction));
			}
		}
	}
}

/* This file is generated by scripts/process-messages/index.js. Do not edit! */


var bold = 'font-weight: bold';
var normal = 'font-weight: normal';

/**
 * %component% mutated a value owned by %owner%. This is strongly discouraged. Consider passing values to child components with `bind:`, or use a callback instead
 * @param {string | undefined | null} [component]
 * @param {string | undefined | null} [owner]
 */
function ownership_invalid_mutation(component, owner) {
	if (DEV) {
		console.warn(`%c[svelte] ownership_invalid_mutation\n%c${component ? `${component} mutated a value owned by ${owner}. This is strongly discouraged. Consider passing values to child components with \`bind:\`, or use a callback instead` : "Mutating a value outside the component that created it is strongly discouraged. Consider passing values to child components with `bind:`, or use a callback instead"}\nhttps://svelte.dev/e/ownership_invalid_mutation`, bold, normal);
	} else {
		console.warn(`https://svelte.dev/e/ownership_invalid_mutation`);
	}
}

/**
 * Reactive `$state(...)` proxies and the values they proxy have different identities. Because of this, comparisons with `%operator%` will produce unexpected results
 * @param {string} operator
 */
function state_proxy_equality_mismatch(operator) {
	if (DEV) {
		console.warn(`%c[svelte] state_proxy_equality_mismatch\n%cReactive \`$state(...)\` proxies and the values they proxy have different identities. Because of this, comparisons with \`${operator}\` will produce unexpected results\nhttps://svelte.dev/e/state_proxy_equality_mismatch`, bold, normal);
	} else {
		console.warn(`https://svelte.dev/e/state_proxy_equality_mismatch`);
	}
}

/** @import { TemplateNode } from '#client' */


/**
 * Use this variable to guard everything related to hydration code so it can be treeshaken out
 * if the user doesn't use the `hydrate` method and these code paths are therefore not needed.
 */
let hydrating = false;

/** @param {TemplateNode} node */
function reset(node) {
	return;
}

/** @import { ProxyMetadata } from '#client' */
/** @typedef {{ file: string, line: number, column: number }} Location */


/** @type {Record<string, Array<{ start: Location, end: Location, component: Function }>>} */
const boundaries = {};

const chrome_pattern = /at (?:.+ \()?(.+):(\d+):(\d+)\)?$/;
const firefox_pattern = /@(.+):(\d+):(\d+)$/;

function get_stack() {
	const stack = new Error().stack;
	if (!stack) return null;

	const entries = [];

	for (const line of stack.split('\n')) {
		let match = chrome_pattern.exec(line) ?? firefox_pattern.exec(line);

		if (match) {
			entries.push({
				file: match[1],
				line: +match[2],
				column: +match[3]
			});
		}
	}

	return entries;
}

/**
 * Determines which `.svelte` component is responsible for a given state change
 * @returns {Function | null}
 */
function get_component() {
	// first 4 lines are svelte internals; adjust this number if we change the internal call stack
	const stack = get_stack()?.slice(4);
	if (!stack) return null;

	for (let i = 0; i < stack.length; i++) {
		const entry = stack[i];
		const modules = boundaries[entry.file];
		if (!modules) {
			// If the first entry is not a component, that means the modification very likely happened
			// within a .svelte.js file, possibly triggered by a component. Since these files are not part
			// of the bondaries/component context heuristic, we need to bail in this case, else we would
			// have false positives when the .svelte.ts file provides a state creator function, encapsulating
			// the state and its mutations, and is being called from a component other than the one who
			// called the state creator function.
			if (i === 0) return null;
			continue;
		}

		for (const module of modules) {
			if (module.end == null) {
				return null;
			}
			if (module.start.line < entry.line && module.end.line > entry.line) {
				return module.component;
			}
		}
	}

	return null;
}

/**
 * Together with `mark_module_end`, this function establishes the boundaries of a `.svelte` file,
 * such that subsequent calls to `get_component` can tell us which component is responsible
 * for a given state change
 */
function mark_module_start() {
	const start = get_stack()?.[2];

	if (start) {
		(boundaries[start.file] ??= []).push({
			start,
			// @ts-expect-error
			end: null,
			// @ts-expect-error we add the component at the end, since HMR will overwrite the function
			component: null
		});
	}
}

/**
 * @param {Function} component
 */
function mark_module_end(component) {
	const end = get_stack()?.[2];

	if (end) {
		const boundaries_file = boundaries[end.file];
		const boundary = boundaries_file[boundaries_file.length - 1];

		boundary.end = end;
		boundary.component = component;
	}
}

/**
 * @param {ProxyMetadata | null} from
 * @param {ProxyMetadata} to
 */
function widen_ownership(from, to) {
	if (to.owners === null) {
		return;
	}

	while (from) {
		if (from.owners === null) {
			to.owners = null;
			break;
		}

		for (const owner of from.owners) {
			to.owners.add(owner);
		}

		from = from.parent;
	}
}

/**
 * @param {ProxyMetadata} metadata
 * @param {Function} component
 * @returns {boolean}
 */
function has_owner(metadata, component) {
	if (metadata.owners === null) {
		return true;
	}

	return (
		metadata.owners.has(component) ||
		(metadata.parent !== null && has_owner(metadata.parent, component))
	);
}

/**
 * @param {ProxyMetadata} metadata
 * @returns {any}
 */
function get_owner(metadata) {
	return (
		metadata?.owners?.values().next().value ??
		get_owner(/** @type {ProxyMetadata} */ (metadata.parent))
	);
}

/**
 * @param {ProxyMetadata} metadata
 */
function check_ownership(metadata) {

	const component = get_component();

	if (component && !has_owner(metadata, component)) {
		let original = get_owner(metadata);

		// @ts-expect-error
		if (original[FILENAME] !== component[FILENAME]) {
			// @ts-expect-error
			ownership_invalid_mutation(component[FILENAME], original[FILENAME]);
		} else {
			ownership_invalid_mutation();
		}
	}
}

/** @import { ProxyMetadata, ProxyStateObject, Source } from '#client' */

/**
 * @template T
 * @param {T} value
 * @param {ProxyMetadata | null} [parent]
 * @param {Source<T>} [prev] dev mode only
 * @returns {T}
 */
function proxy(value, parent = null, prev) {
	/** @type {Error | null} */
	var stack = null;
	if (DEV && tracing_mode_flag) {
		stack = get_stack$1('CreatedAt');
	}
	// if non-proxyable, or is already a proxy, return `value`
	if (typeof value !== 'object' || value === null || STATE_SYMBOL in value) {
		return value;
	}

	const prototype = get_prototype_of(value);

	if (prototype !== object_prototype && prototype !== array_prototype) {
		return value;
	}

	/** @type {Map<any, Source<any>>} */
	var sources = new Map();
	var is_proxied_array = is_array(value);
	var version = source(0);

	if (is_proxied_array) {
		// We need to create the length source eagerly to ensure that
		// mutations to the array are properly synced with our proxy
		sources.set('length', source(/** @type {any[]} */ (value).length, stack));
	}

	/** @type {ProxyMetadata} */
	var metadata;

	if (DEV) {
		metadata = {
			parent,
			owners: null
		};

		{
			metadata.owners =
				parent === null
					? component_context !== null
						? new Set([component_context.function])
						: null
					: new Set();
		}
	}

	return new Proxy(/** @type {any} */ (value), {
		defineProperty(_, prop, descriptor) {
			if (
				!('value' in descriptor) ||
				descriptor.configurable === false ||
				descriptor.enumerable === false ||
				descriptor.writable === false
			) {
				// we disallow non-basic descriptors, because unless they are applied to the
				// target object — which we avoid, so that state can be forked — we will run
				// afoul of the various invariants
				// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Proxy/Proxy/getOwnPropertyDescriptor#invariants
				state_descriptors_fixed();
			}

			var s = sources.get(prop);

			if (s === undefined) {
				s = source(descriptor.value, stack);
				sources.set(prop, s);
			} else {
				set(s, proxy(descriptor.value, metadata));
			}

			return true;
		},

		deleteProperty(target, prop) {
			var s = sources.get(prop);

			if (s === undefined) {
				if (prop in target) {
					sources.set(prop, source(UNINITIALIZED, stack));
				}
			} else {
				// When working with arrays, we need to also ensure we update the length when removing
				// an indexed property
				if (is_proxied_array && typeof prop === 'string') {
					var ls = /** @type {Source<number>} */ (sources.get('length'));
					var n = Number(prop);

					if (Number.isInteger(n) && n < ls.v) {
						set(ls, n);
					}
				}
				set(s, UNINITIALIZED);
				update_version(version);
			}

			return true;
		},

		get(target, prop, receiver) {
			if (DEV && prop === STATE_SYMBOL_METADATA) {
				return metadata;
			}

			if (prop === STATE_SYMBOL) {
				return value;
			}

			var s = sources.get(prop);
			var exists = prop in target;

			// create a source, but only if it's an own property and not a prototype property
			if (s === undefined && (!exists || get_descriptor(target, prop)?.writable)) {
				s = source(proxy(exists ? target[prop] : UNINITIALIZED, metadata), stack);
				sources.set(prop, s);
			}

			if (s !== undefined) {
				var v = get(s);

				// In case of something like `foo = bar.map(...)`, foo would have ownership
				// of the array itself, while the individual items would have ownership
				// of the component that created bar. That means if we later do `foo[0].baz = 42`,
				// we could get a false-positive ownership violation, since the two proxies
				// are not connected to each other via the parent metadata relationship.
				// For this reason, we need to widen the ownership of the children
				// upon access when we detect they are not connected.
				if (DEV) {
					/** @type {ProxyMetadata | undefined} */
					var prop_metadata = v?.[STATE_SYMBOL_METADATA];
					if (prop_metadata && prop_metadata?.parent !== metadata) {
						widen_ownership(metadata, prop_metadata);
					}
				}

				return v === UNINITIALIZED ? undefined : v;
			}

			return Reflect.get(target, prop, receiver);
		},

		getOwnPropertyDescriptor(target, prop) {
			var descriptor = Reflect.getOwnPropertyDescriptor(target, prop);

			if (descriptor && 'value' in descriptor) {
				var s = sources.get(prop);
				if (s) descriptor.value = get(s);
			} else if (descriptor === undefined) {
				var source = sources.get(prop);
				var value = source?.v;

				if (source !== undefined && value !== UNINITIALIZED) {
					return {
						enumerable: true,
						configurable: true,
						value,
						writable: true
					};
				}
			}

			return descriptor;
		},

		has(target, prop) {
			if (DEV && prop === STATE_SYMBOL_METADATA) {
				return true;
			}

			if (prop === STATE_SYMBOL) {
				return true;
			}

			var s = sources.get(prop);
			var has = (s !== undefined && s.v !== UNINITIALIZED) || Reflect.has(target, prop);

			if (
				s !== undefined ||
				(active_effect !== null && (!has || get_descriptor(target, prop)?.writable))
			) {
				if (s === undefined) {
					s = source(has ? proxy(target[prop], metadata) : UNINITIALIZED, stack);
					sources.set(prop, s);
				}

				var value = get(s);
				if (value === UNINITIALIZED) {
					return false;
				}
			}

			return has;
		},

		set(target, prop, value, receiver) {
			var s = sources.get(prop);
			var has = prop in target;

			// variable.length = value -> clear all signals with index >= value
			if (is_proxied_array && prop === 'length') {
				for (var i = value; i < /** @type {Source<number>} */ (s).v; i += 1) {
					var other_s = sources.get(i + '');
					if (other_s !== undefined) {
						set(other_s, UNINITIALIZED);
					} else if (i in target) {
						// If the item exists in the original, we need to create a uninitialized source,
						// else a later read of the property would result in a source being created with
						// the value of the original item at that index.
						other_s = source(UNINITIALIZED, stack);
						sources.set(i + '', other_s);
					}
				}
			}

			// If we haven't yet created a source for this property, we need to ensure
			// we do so otherwise if we read it later, then the write won't be tracked and
			// the heuristics of effects will be different vs if we had read the proxied
			// object property before writing to that property.
			if (s === undefined) {
				if (!has || get_descriptor(target, prop)?.writable) {
					s = source(undefined, stack);
					set(s, proxy(value, metadata));
					sources.set(prop, s);
				}
			} else {
				has = s.v !== UNINITIALIZED;
				set(s, proxy(value, metadata));
			}

			if (DEV) {
				/** @type {ProxyMetadata | undefined} */
				var prop_metadata = value?.[STATE_SYMBOL_METADATA];
				if (prop_metadata && prop_metadata?.parent !== metadata) {
					widen_ownership(metadata, prop_metadata);
				}
				check_ownership(metadata);
			}

			var descriptor = Reflect.getOwnPropertyDescriptor(target, prop);

			// Set the new value before updating any signals so that any listeners get the new value
			if (descriptor?.set) {
				descriptor.set.call(receiver, value);
			}

			if (!has) {
				// If we have mutated an array directly, we might need to
				// signal that length has also changed. Do it before updating metadata
				// to ensure that iterating over the array as a result of a metadata update
				// will not cause the length to be out of sync.
				if (is_proxied_array && typeof prop === 'string') {
					var ls = /** @type {Source<number>} */ (sources.get('length'));
					var n = Number(prop);

					if (Number.isInteger(n) && n >= ls.v) {
						set(ls, n + 1);
					}
				}

				update_version(version);
			}

			return true;
		},

		ownKeys(target) {
			get(version);

			var own_keys = Reflect.ownKeys(target).filter((key) => {
				var source = sources.get(key);
				return source === undefined || source.v !== UNINITIALIZED;
			});

			for (var [key, source] of sources) {
				if (source.v !== UNINITIALIZED && !(key in target)) {
					own_keys.push(key);
				}
			}

			return own_keys;
		},

		setPrototypeOf() {
			state_prototype_fixed();
		}
	});
}

/**
 * @param {Source<number>} signal
 * @param {1 | -1} [d]
 */
function update_version(signal, d = 1) {
	set(signal, signal.v + d);
}

/**
 * @param {any} value
 */
function get_proxied_value(value) {
	if (value !== null && typeof value === 'object' && STATE_SYMBOL in value) {
		return value[STATE_SYMBOL];
	}

	return value;
}

function init_array_prototype_warnings() {
	const array_prototype = Array.prototype;
	// The REPL ends up here over and over, and this prevents it from adding more and more patches
	// of the same kind to the prototype, which would slow down everything over time.
	// @ts-expect-error
	const cleanup = Array.__svelte_cleanup;
	if (cleanup) {
		cleanup();
	}

	const { indexOf, lastIndexOf, includes } = array_prototype;

	array_prototype.indexOf = function (item, from_index) {
		const index = indexOf.call(this, item, from_index);

		if (index === -1) {
			for (let i = from_index ?? 0; i < this.length; i += 1) {
				if (get_proxied_value(this[i]) === item) {
					state_proxy_equality_mismatch('array.indexOf(...)');
					break;
				}
			}
		}

		return index;
	};

	array_prototype.lastIndexOf = function (item, from_index) {
		// we need to specify this.length - 1 because it's probably using something like
		// `arguments` inside so passing undefined is different from not passing anything
		const index = lastIndexOf.call(this, item, from_index ?? this.length - 1);

		if (index === -1) {
			for (let i = 0; i <= (from_index ?? this.length - 1); i += 1) {
				if (get_proxied_value(this[i]) === item) {
					state_proxy_equality_mismatch('array.lastIndexOf(...)');
					break;
				}
			}
		}

		return index;
	};

	array_prototype.includes = function (item, from_index) {
		const has = includes.call(this, item, from_index);

		if (!has) {
			for (let i = 0; i < this.length; i += 1) {
				if (get_proxied_value(this[i]) === item) {
					state_proxy_equality_mismatch('array.includes(...)');
					break;
				}
			}
		}

		return has;
	};

	// @ts-expect-error
	Array.__svelte_cleanup = () => {
		array_prototype.indexOf = indexOf;
		array_prototype.lastIndexOf = lastIndexOf;
		array_prototype.includes = includes;
	};
}

/**
 * @param {any} a
 * @param {any} b
 * @param {boolean} equal
 * @returns {boolean}
 */
function strict_equals(a, b, equal = true) {
	// try-catch needed because this tries to read properties of `a` and `b`,
	// which could be disallowed for example in a secure context
	try {
		if ((a === b) !== (get_proxied_value(a) === get_proxied_value(b))) {
			state_proxy_equality_mismatch(equal ? '===' : '!==');
		}
	} catch {}

	return (a === b) === equal;
}

/**
 * @param {any} a
 * @param {any} b
 * @param {boolean} equal
 * @returns {boolean}
 */
function equals(a, b, equal = true) {
	if ((a == b) !== (get_proxied_value(a) == get_proxied_value(b))) {
		state_proxy_equality_mismatch(equal ? '==' : '!=');
	}

	return (a == b) === equal;
}

/** @import { TemplateNode } from '#client' */

// export these for reference in the compiled code, making global name deduplication unnecessary
/** @type {Window} */
var $window;

/** @type {() => Node | null} */
var first_child_getter;
/** @type {() => Node | null} */
var next_sibling_getter;

/**
 * Initialize these lazily to avoid issues when using the runtime in a server context
 * where these globals are not available while avoiding a separate server entry point
 */
function init_operations() {
	if ($window !== undefined) {
		return;
	}

	$window = window;

	var element_prototype = Element.prototype;
	var node_prototype = Node.prototype;

	// @ts-ignore
	first_child_getter = get_descriptor(node_prototype, 'firstChild').get;
	// @ts-ignore
	next_sibling_getter = get_descriptor(node_prototype, 'nextSibling').get;

	// the following assignments improve perf of lookups on DOM nodes
	// @ts-expect-error
	element_prototype.__click = undefined;
	// @ts-expect-error
	element_prototype.__className = '';
	// @ts-expect-error
	element_prototype.__attributes = null;
	// @ts-expect-error
	element_prototype.__styles = null;
	// @ts-expect-error
	element_prototype.__e = undefined;

	// @ts-expect-error
	Text.prototype.__t = undefined;

	if (DEV) {
		// @ts-expect-error
		element_prototype.__svelte_meta = null;

		init_array_prototype_warnings();
	}
}

/**
 * @param {string} value
 * @returns {Text}
 */
function create_text(value = '') {
	return document.createTextNode(value);
}

/**
 * @template {Node} N
 * @param {N} node
 * @returns {Node | null}
 */
/*@__NO_SIDE_EFFECTS__*/
function get_first_child(node) {
	return first_child_getter.call(node);
}

/**
 * @template {Node} N
 * @param {N} node
 * @returns {Node | null}
 */
/*@__NO_SIDE_EFFECTS__*/
function get_next_sibling(node) {
	return next_sibling_getter.call(node);
}

/**
 * Don't mark this as side-effect-free, hydration needs to walk all nodes
 * @template {Node} N
 * @param {N} node
 * @param {boolean} is_text
 * @returns {Node | null}
 */
function child(node, is_text) {
	{
		return get_first_child(node);
	}
}

/**
 * Don't mark this as side-effect-free, hydration needs to walk all nodes
 * @param {DocumentFragment | TemplateNode[]} fragment
 * @param {boolean} is_text
 * @returns {Node | null}
 */
function first_child(fragment, is_text) {
	{
		// when not hydrating, `fragment` is a `DocumentFragment` (the result of calling `open_frag`)
		var first = /** @type {DocumentFragment} */ (get_first_child(/** @type {Node} */ (fragment)));

		// TODO prevent user comments with the empty string when preserveComments is true
		if (first instanceof Comment && first.data === '') return get_next_sibling(first);

		return first;
	}
}

/**
 * Don't mark this as side-effect-free, hydration needs to walk all nodes
 * @param {TemplateNode} node
 * @param {number} count
 * @param {boolean} is_text
 * @returns {Node | null}
 */
function sibling(node, count = 1, is_text = false) {
	let next_sibling = node;

	while (count--) {
		next_sibling = /** @type {TemplateNode} */ (get_next_sibling(next_sibling));
	}

	{
		return next_sibling;
	}
}

/**
 * @template {Node} N
 * @param {N} node
 * @returns {void}
 */
function clear_text_content(node) {
	node.textContent = '';
}

/** @import { Derived, Effect } from '#client' */

/**
 * @template V
 * @param {() => V} fn
 * @returns {Derived<V>}
 */
/*#__NO_SIDE_EFFECTS__*/
function derived(fn) {
	var flags = DERIVED | DIRTY;

	if (active_effect === null) {
		flags |= UNOWNED;
	} else {
		// Since deriveds are evaluated lazily, any effects created inside them are
		// created too late to ensure that the parent effect is added to the tree
		active_effect.f |= EFFECT_HAS_DERIVED;
	}

	var parent_derived =
		active_reaction !== null && (active_reaction.f & DERIVED) !== 0
			? /** @type {Derived} */ (active_reaction)
			: null;

	/** @type {Derived<V>} */
	const signal = {
		children: null,
		ctx: component_context,
		deps: null,
		equals: equals$1,
		f: flags,
		fn,
		reactions: null,
		v: /** @type {V} */ (null),
		version: 0,
		parent: parent_derived ?? active_effect
	};

	if (DEV && tracing_mode_flag) {
		signal.created = get_stack$1('CreatedAt');
	}

	if (parent_derived !== null) {
		(parent_derived.children ??= []).push(signal);
	}

	return signal;
}

/**
 * @template V
 * @param {() => V} fn
 * @returns {Derived<V>}
 */
/*#__NO_SIDE_EFFECTS__*/
function derived_safe_equal(fn) {
	const signal = derived(fn);
	signal.equals = safe_equals;
	return signal;
}

/**
 * @param {Derived} derived
 * @returns {void}
 */
function destroy_derived_children(derived) {
	var children = derived.children;

	if (children !== null) {
		derived.children = null;

		for (var i = 0; i < children.length; i += 1) {
			var child = children[i];
			if ((child.f & DERIVED) !== 0) {
				destroy_derived(/** @type {Derived} */ (child));
			} else {
				destroy_effect(/** @type {Effect} */ (child));
			}
		}
	}
}

/**
 * The currently updating deriveds, used to detect infinite recursion
 * in dev mode and provide a nicer error than 'too much recursion'
 * @type {Derived[]}
 */
let stack = [];

/**
 * @param {Derived} derived
 * @returns {Effect | null}
 */
function get_derived_parent_effect(derived) {
	var parent = derived.parent;
	while (parent !== null) {
		if ((parent.f & DERIVED) === 0) {
			return /** @type {Effect} */ (parent);
		}
		parent = parent.parent;
	}
	return null;
}

/**
 * @template T
 * @param {Derived} derived
 * @returns {T}
 */
function execute_derived(derived) {
	var value;
	var prev_active_effect = active_effect;

	set_active_effect(get_derived_parent_effect(derived));

	if (DEV) {
		let prev_inspect_effects = inspect_effects;
		set_inspect_effects(new Set());
		try {
			if (stack.includes(derived)) {
				derived_references_self();
			}

			stack.push(derived);

			destroy_derived_children(derived);
			value = update_reaction(derived);
		} finally {
			set_active_effect(prev_active_effect);
			set_inspect_effects(prev_inspect_effects);
			stack.pop();
		}
	} else {
		try {
			destroy_derived_children(derived);
			value = update_reaction(derived);
		} finally {
			set_active_effect(prev_active_effect);
		}
	}

	return value;
}

/**
 * @param {Derived} derived
 * @returns {void}
 */
function update_derived(derived) {
	var value = execute_derived(derived);
	var status =
		(skip_reaction || (derived.f & UNOWNED) !== 0) && derived.deps !== null ? MAYBE_DIRTY : CLEAN;

	set_signal_status(derived, status);

	if (!derived.equals(value)) {
		derived.v = value;
		derived.version = increment_version();
	}
}

/**
 * @param {Derived} derived
 * @returns {void}
 */
function destroy_derived(derived) {
	destroy_derived_children(derived);
	remove_reactions(derived, 0);
	set_signal_status(derived, DESTROYED);

	derived.v = derived.children = derived.deps = derived.ctx = derived.reactions = null;
}

/** @import { ComponentContext, ComponentContextLegacy, Derived, Effect, TemplateNode, TransitionManager } from '#client' */

/**
 * @param {'$effect' | '$effect.pre' | '$inspect'} rune
 */
function validate_effect(rune) {
	if (active_effect === null && active_reaction === null) {
		effect_orphan(rune);
	}

	if (active_reaction !== null && (active_reaction.f & UNOWNED) !== 0) {
		effect_in_unowned_derived();
	}

	if (is_destroying_effect) {
		effect_in_teardown(rune);
	}
}

/**
 * @param {Effect} effect
 * @param {Effect} parent_effect
 */
function push_effect(effect, parent_effect) {
	var parent_last = parent_effect.last;
	if (parent_last === null) {
		parent_effect.last = parent_effect.first = effect;
	} else {
		parent_last.next = effect;
		effect.prev = parent_last;
		parent_effect.last = effect;
	}
}

/**
 * @param {number} type
 * @param {null | (() => void | (() => void))} fn
 * @param {boolean} sync
 * @param {boolean} push
 * @returns {Effect}
 */
function create_effect(type, fn, sync, push = true) {
	var is_root = (type & ROOT_EFFECT) !== 0;
	var parent_effect = active_effect;

	if (DEV) {
		// Ensure the parent is never an inspect effect
		while (parent_effect !== null && (parent_effect.f & INSPECT_EFFECT) !== 0) {
			parent_effect = parent_effect.parent;
		}
	}

	/** @type {Effect} */
	var effect = {
		ctx: component_context,
		deps: null,
		deriveds: null,
		nodes_start: null,
		nodes_end: null,
		f: type | DIRTY,
		first: null,
		fn,
		last: null,
		next: null,
		parent: is_root ? null : parent_effect,
		prev: null,
		teardown: null,
		transitions: null,
		version: 0
	};

	if (DEV) {
		effect.component_function = dev_current_component_function;
	}

	if (sync) {
		var previously_flushing_effect = is_flushing_effect;

		try {
			set_is_flushing_effect(true);
			update_effect(effect);
			effect.f |= EFFECT_RAN;
		} catch (e) {
			destroy_effect(effect);
			throw e;
		} finally {
			set_is_flushing_effect(previously_flushing_effect);
		}
	} else if (fn !== null) {
		schedule_effect(effect);
	}

	// if an effect has no dependencies, no DOM and no teardown function,
	// don't bother adding it to the effect tree
	var inert =
		sync &&
		effect.deps === null &&
		effect.first === null &&
		effect.nodes_start === null &&
		effect.teardown === null &&
		(effect.f & EFFECT_HAS_DERIVED) === 0;

	if (!inert && !is_root && push) {
		if (parent_effect !== null) {
			push_effect(effect, parent_effect);
		}

		// if we're in a derived, add the effect there too
		if (active_reaction !== null && (active_reaction.f & DERIVED) !== 0) {
			var derived = /** @type {Derived} */ (active_reaction);
			(derived.children ??= []).push(effect);
		}
	}

	return effect;
}

/**
 * Internal representation of `$effect(...)`
 * @param {() => void | (() => void)} fn
 */
function user_effect(fn) {
	validate_effect('$effect');

	// Non-nested `$effect(...)` in a component should be deferred
	// until the component is mounted
	var defer =
		active_effect !== null &&
		(active_effect.f & BRANCH_EFFECT) !== 0 &&
		component_context !== null &&
		!component_context.m;

	if (DEV) {
		define_property(fn, 'name', {
			value: '$effect'
		});
	}

	if (defer) {
		var context = /** @type {ComponentContext} */ (component_context);
		(context.e ??= []).push({
			fn,
			effect: active_effect,
			reaction: active_reaction
		});
	} else {
		var signal = effect(fn);
		return signal;
	}
}

/**
 * An effect root whose children can transition out
 * @param {() => void} fn
 * @returns {(options?: { outro?: boolean }) => Promise<void>}
 */
function component_root(fn) {
	const effect = create_effect(ROOT_EFFECT, fn, true);

	return (options = {}) => {
		return new Promise((fulfil) => {
			if (options.outro) {
				pause_effect(effect, () => {
					destroy_effect(effect);
					fulfil(undefined);
				});
			} else {
				destroy_effect(effect);
				fulfil(undefined);
			}
		});
	};
}

/**
 * @param {() => void | (() => void)} fn
 * @returns {Effect}
 */
function effect(fn) {
	return create_effect(EFFECT, fn, false);
}

/**
 * @param {() => void | (() => void)} fn
 * @returns {Effect}
 */
function render_effect(fn) {
	return create_effect(RENDER_EFFECT, fn, true);
}

/**
 * @param {() => void | (() => void)} fn
 * @returns {Effect}
 */
function template_effect(fn) {
	if (DEV) {
		define_property(fn, 'name', {
			value: '{expression}'
		});
	}
	return block(fn);
}

/**
 * @param {(() => void)} fn
 * @param {number} flags
 */
function block(fn, flags = 0) {
	return create_effect(RENDER_EFFECT | BLOCK_EFFECT | flags, fn, true);
}

/**
 * @param {(() => void)} fn
 * @param {boolean} [push]
 */
function branch(fn, push = true) {
	return create_effect(RENDER_EFFECT | BRANCH_EFFECT, fn, true, push);
}

/**
 * @param {Effect} effect
 */
function execute_effect_teardown(effect) {
	var teardown = effect.teardown;
	if (teardown !== null) {
		const previously_destroying_effect = is_destroying_effect;
		const previous_reaction = active_reaction;
		set_is_destroying_effect(true);
		set_active_reaction(null);
		try {
			teardown.call(null);
		} finally {
			set_is_destroying_effect(previously_destroying_effect);
			set_active_reaction(previous_reaction);
		}
	}
}

/**
 * @param {Effect} signal
 * @returns {void}
 */
function destroy_effect_deriveds(signal) {
	var deriveds = signal.deriveds;

	if (deriveds !== null) {
		signal.deriveds = null;

		for (var i = 0; i < deriveds.length; i += 1) {
			destroy_derived(deriveds[i]);
		}
	}
}

/**
 * @param {Effect} signal
 * @param {boolean} remove_dom
 * @returns {void}
 */
function destroy_effect_children(signal, remove_dom = false) {
	var effect = signal.first;
	signal.first = signal.last = null;

	while (effect !== null) {
		var next = effect.next;
		destroy_effect(effect, remove_dom);
		effect = next;
	}
}

/**
 * @param {Effect} signal
 * @returns {void}
 */
function destroy_block_effect_children(signal) {
	var effect = signal.first;

	while (effect !== null) {
		var next = effect.next;
		if ((effect.f & BRANCH_EFFECT) === 0) {
			destroy_effect(effect);
		}
		effect = next;
	}
}

/**
 * @param {Effect} effect
 * @param {boolean} [remove_dom]
 * @returns {void}
 */
function destroy_effect(effect, remove_dom = true) {
	var removed = false;

	if ((remove_dom || (effect.f & HEAD_EFFECT) !== 0) && effect.nodes_start !== null) {
		/** @type {TemplateNode | null} */
		var node = effect.nodes_start;
		var end = effect.nodes_end;

		while (node !== null) {
			/** @type {TemplateNode | null} */
			var next = node === end ? null : /** @type {TemplateNode} */ (get_next_sibling(node));

			node.remove();
			node = next;
		}

		removed = true;
	}

	destroy_effect_children(effect, remove_dom && !removed);
	destroy_effect_deriveds(effect);
	remove_reactions(effect, 0);
	set_signal_status(effect, DESTROYED);

	var transitions = effect.transitions;

	if (transitions !== null) {
		for (const transition of transitions) {
			transition.stop();
		}
	}

	execute_effect_teardown(effect);

	var parent = effect.parent;

	// If the parent doesn't have any children, then skip this work altogether
	if (parent !== null && parent.first !== null) {
		unlink_effect(effect);
	}

	if (DEV) {
		effect.component_function = null;
	}

	// `first` and `child` are nulled out in destroy_effect_children
	// we don't null out `parent` so that error propagation can work correctly
	effect.next =
		effect.prev =
		effect.teardown =
		effect.ctx =
		effect.deps =
		effect.fn =
		effect.nodes_start =
		effect.nodes_end =
			null;
}

/**
 * Detach an effect from the effect tree, freeing up memory and
 * reducing the amount of work that happens on subsequent traversals
 * @param {Effect} effect
 */
function unlink_effect(effect) {
	var parent = effect.parent;
	var prev = effect.prev;
	var next = effect.next;

	if (prev !== null) prev.next = next;
	if (next !== null) next.prev = prev;

	if (parent !== null) {
		if (parent.first === effect) parent.first = next;
		if (parent.last === effect) parent.last = prev;
	}
}

/**
 * When a block effect is removed, we don't immediately destroy it or yank it
 * out of the DOM, because it might have transitions. Instead, we 'pause' it.
 * It stays around (in memory, and in the DOM) until outro transitions have
 * completed, and if the state change is reversed then we _resume_ it.
 * A paused effect does not update, and the DOM subtree becomes inert.
 * @param {Effect} effect
 * @param {() => void} [callback]
 */
function pause_effect(effect, callback) {
	/** @type {TransitionManager[]} */
	var transitions = [];

	pause_children(effect, transitions, true);

	run_out_transitions(transitions, () => {
		destroy_effect(effect);
		if (callback) callback();
	});
}

/**
 * @param {TransitionManager[]} transitions
 * @param {() => void} fn
 */
function run_out_transitions(transitions, fn) {
	var remaining = transitions.length;
	if (remaining > 0) {
		var check = () => --remaining || fn();
		for (var transition of transitions) {
			transition.out(check);
		}
	} else {
		fn();
	}
}

/**
 * @param {Effect} effect
 * @param {TransitionManager[]} transitions
 * @param {boolean} local
 */
function pause_children(effect, transitions, local) {
	if ((effect.f & INERT) !== 0) return;
	effect.f ^= INERT;

	if (effect.transitions !== null) {
		for (const transition of effect.transitions) {
			if (transition.is_global || local) {
				transitions.push(transition);
			}
		}
	}

	var child = effect.first;

	while (child !== null) {
		var sibling = child.next;
		var transparent = (child.f & EFFECT_TRANSPARENT) !== 0 || (child.f & BRANCH_EFFECT) !== 0;
		// TODO we don't need to call pause_children recursively with a linked list in place
		// it's slightly more involved though as we have to account for `transparent` changing
		// through the tree.
		pause_children(child, transitions, transparent ? local : false);
		child = sibling;
	}
}

/**
 * The opposite of `pause_effect`. We call this if (for example)
 * `x` becomes falsy then truthy: `{#if x}...{/if}`
 * @param {Effect} effect
 */
function resume_effect(effect) {
	resume_children(effect, true);
}

/**
 * @param {Effect} effect
 * @param {boolean} local
 */
function resume_children(effect, local) {
	if ((effect.f & INERT) === 0) return;

	// If a dependency of this effect changed while it was paused,
	// apply the change now
	if (check_dirtiness(effect)) {
		update_effect(effect);
	}

	// Ensure we toggle the flag after possibly updating the effect so that
	// each block logic can correctly operate on inert items
	effect.f ^= INERT;

	var child = effect.first;

	while (child !== null) {
		var sibling = child.next;
		var transparent = (child.f & EFFECT_TRANSPARENT) !== 0 || (child.f & BRANCH_EFFECT) !== 0;
		// TODO we don't need to call resume_children recursively with a linked list in place
		// it's slightly more involved though as we have to account for `transparent` changing
		// through the tree.
		resume_children(child, transparent ? local : false);
		child = sibling;
	}

	if (effect.transitions !== null) {
		for (const transition of effect.transitions) {
			if (transition.is_global || local) {
				transition.in();
			}
		}
	}
}

let is_micro_task_queued$1 = false;

/** @type {Array<() => void>} */
let current_queued_micro_tasks = [];

function process_micro_tasks() {
	is_micro_task_queued$1 = false;
	const tasks = current_queued_micro_tasks.slice();
	current_queued_micro_tasks = [];
	run_all(tasks);
}

/**
 * @param {() => void} fn
 */
function queue_micro_task(fn) {
	if (!is_micro_task_queued$1) {
		is_micro_task_queued$1 = true;
		queueMicrotask(process_micro_tasks);
	}
	current_queued_micro_tasks.push(fn);
}

/**
 * Synchronously run any queued tasks.
 */
function flush_tasks() {
	if (is_micro_task_queued$1) {
		process_micro_tasks();
	}
}

/** @import { ComponentContext, Derived, Effect, Reaction, Signal, Source, Value } from '#client' */

const FLUSH_MICROTASK = 0;
const FLUSH_SYNC = 1;
// Used for DEV time error handling
/** @param {WeakSet<Error>} value */
const handled_errors = new WeakSet();
let is_throwing_error = false;

// Used for controlling the flush of effects.
let scheduler_mode = FLUSH_MICROTASK;
// Used for handling scheduling
let is_micro_task_queued = false;

/** @type {Effect | null} */
let last_scheduled_effect = null;

let is_flushing_effect = false;
let is_destroying_effect = false;

/** @param {boolean} value */
function set_is_flushing_effect(value) {
	is_flushing_effect = value;
}

/** @param {boolean} value */
function set_is_destroying_effect(value) {
	is_destroying_effect = value;
}

// Handle effect queues

/** @type {Effect[]} */
let queued_root_effects = [];

let flush_count = 0;
/** @type {Effect[]} Stack of effects, dev only */
let dev_effect_stack = [];
// Handle signal reactivity tree dependencies and reactions

/** @type {null | Reaction} */
let active_reaction = null;

/** @param {null | Reaction} reaction */
function set_active_reaction(reaction) {
	active_reaction = reaction;
}

/** @type {null | Effect} */
let active_effect = null;

/** @param {null | Effect} effect */
function set_active_effect(effect) {
	active_effect = effect;
}

/**
 * When sources are created within a derived, we record them so that we can safely allow
 * local mutations to these sources without the side-effect error being invoked unnecessarily.
 * @type {null | Source[]}
 */
let derived_sources = null;

/**
 * @param {Source[] | null} sources
 */
function set_derived_sources(sources) {
	derived_sources = sources;
}

/**
 * The dependencies of the reaction that is currently being executed. In many cases,
 * the dependencies are unchanged between runs, and so this will be `null` unless
 * and until a new dependency is accessed — we track this via `skipped_deps`
 * @type {null | Value[]}
 */
let new_deps = null;

let skipped_deps = 0;

/**
 * Tracks writes that the effect it's executed in doesn't listen to yet,
 * so that the dependency can be added to the effect later on if it then reads it
 * @type {null | Source[]}
 */
let untracked_writes = null;

/** @param {null | Source[]} value */
function set_untracked_writes(value) {
	untracked_writes = value;
}

/** @type {number} Used by sources and deriveds for handling updates to unowned deriveds it starts from 1 to differentiate between a created effect and a run one for tracing */
let current_version = 1;

// If we are working with a get() chain that has no active container,
// to prevent memory leaks, we skip adding the reaction.
let skip_reaction = false;

// Handling runtime component context
/** @type {ComponentContext | null} */
let component_context = null;

/** @param {ComponentContext | null} context */
function set_component_context(context) {
	component_context = context;
}

/**
 * The current component function. Different from current component context:
 * ```html
 * <!-- App.svelte -->
 * <Foo>
 *   <Bar /> <!-- context == Foo.svelte, function == App.svelte -->
 * </Foo>
 * ```
 * @type {ComponentContext['function']}
 */
let dev_current_component_function = null;

/** @param {ComponentContext['function']} fn */
function set_dev_current_component_function(fn) {
	dev_current_component_function = fn;
}

function increment_version() {
	return ++current_version;
}

/** @returns {boolean} */
function is_runes() {
	return !legacy_mode_flag || (component_context !== null && component_context.l === null);
}

/**
 * Determines whether a derived or effect is dirty.
 * If it is MAYBE_DIRTY, will set the status to CLEAN
 * @param {Reaction} reaction
 * @returns {boolean}
 */
function check_dirtiness(reaction) {
	var flags = reaction.f;

	if ((flags & DIRTY) !== 0) {
		return true;
	}

	if ((flags & MAYBE_DIRTY) !== 0) {
		var dependencies = reaction.deps;
		var is_unowned = (flags & UNOWNED) !== 0;

		if (dependencies !== null) {
			var i;

			if ((flags & DISCONNECTED) !== 0) {
				for (i = 0; i < dependencies.length; i++) {
					(dependencies[i].reactions ??= []).push(reaction);
				}

				reaction.f ^= DISCONNECTED;
			}

			for (i = 0; i < dependencies.length; i++) {
				var dependency = dependencies[i];

				if (check_dirtiness(/** @type {Derived} */ (dependency))) {
					update_derived(/** @type {Derived} */ (dependency));
				}

				// If we are working with an unowned signal as part of an effect (due to !skip_reaction)
				// and the version hasn't changed, we still need to check that this reaction
				// is linked to the dependency source – otherwise future updates will not be caught.
				if (
					is_unowned &&
					active_effect !== null &&
					!skip_reaction &&
					!dependency?.reactions?.includes(reaction)
				) {
					(dependency.reactions ??= []).push(reaction);
				}

				if (dependency.version > reaction.version) {
					return true;
				}
			}
		}

		// Unowned signals should never be marked as clean unless they
		// are used within an active_effect without skip_reaction
		if (!is_unowned || (active_effect !== null && !skip_reaction)) {
			set_signal_status(reaction, CLEAN);
		}
	}

	return false;
}

/**
 * @param {unknown} error
 * @param {Effect} effect
 */
function propagate_error(error, effect) {
	/** @type {Effect | null} */
	var current = effect;

	while (current !== null) {
		if ((current.f & BOUNDARY_EFFECT) !== 0) {
			try {
				// @ts-expect-error
				current.fn(error);
				return;
			} catch {
				// Remove boundary flag from effect
				current.f ^= BOUNDARY_EFFECT;
			}
		}

		current = current.parent;
	}

	is_throwing_error = false;
	throw error;
}

/**
 * @param {Effect} effect
 */
function should_rethrow_error(effect) {
	return (
		(effect.f & DESTROYED) === 0 &&
		(effect.parent === null || (effect.parent.f & BOUNDARY_EFFECT) === 0)
	);
}

/**
 * @param {unknown} error
 * @param {Effect} effect
 * @param {Effect | null} previous_effect
 * @param {ComponentContext | null} component_context
 */
function handle_error(error, effect, previous_effect, component_context) {
	if (is_throwing_error) {
		if (previous_effect === null) {
			is_throwing_error = false;
		}

		if (should_rethrow_error(effect)) {
			throw error;
		}

		return;
	}

	if (previous_effect !== null) {
		is_throwing_error = true;
	}

	if (
		!DEV ||
		component_context === null ||
		!(error instanceof Error) ||
		handled_errors.has(error)
	) {
		propagate_error(error, effect);
		return;
	}

	handled_errors.add(error);

	const component_stack = [];

	const effect_name = effect.fn?.name;

	if (effect_name) {
		component_stack.push(effect_name);
	}

	/** @type {ComponentContext | null} */
	let current_context = component_context;

	while (current_context !== null) {
		if (DEV) {
			/** @type {string} */
			var filename = current_context.function?.[FILENAME];

			if (filename) {
				const file = filename.split('/').pop();
				component_stack.push(file);
			}
		}

		current_context = current_context.p;
	}

	const indent = /Firefox/.test(navigator.userAgent) ? '  ' : '\t';
	define_property(error, 'message', {
		value: error.message + `\n${component_stack.map((name) => `\n${indent}in ${name}`).join('')}\n`
	});
	define_property(error, 'component_stack', {
		value: component_stack
	});

	const stack = error.stack;

	// Filter out internal files from callstack
	if (stack) {
		const lines = stack.split('\n');
		const new_lines = [];
		for (let i = 0; i < lines.length; i++) {
			const line = lines[i];
			if (line.includes('svelte/src/internal')) {
				continue;
			}
			new_lines.push(line);
		}
		define_property(error, 'stack', {
			value: new_lines.join('\n')
		});
	}

	propagate_error(error, effect);

	if (should_rethrow_error(effect)) {
		throw error;
	}
}

/**
 * @template V
 * @param {Reaction} reaction
 * @returns {V}
 */
function update_reaction(reaction) {
	var previous_deps = new_deps;
	var previous_skipped_deps = skipped_deps;
	var previous_untracked_writes = untracked_writes;
	var previous_reaction = active_reaction;
	var previous_skip_reaction = skip_reaction;
	var prev_derived_sources = derived_sources;
	var previous_component_context = component_context;
	var flags = reaction.f;

	new_deps = /** @type {null | Value[]} */ (null);
	skipped_deps = 0;
	untracked_writes = null;
	active_reaction = (flags & (BRANCH_EFFECT | ROOT_EFFECT)) === 0 ? reaction : null;
	skip_reaction = !is_flushing_effect && (flags & UNOWNED) !== 0;
	derived_sources = null;
	component_context = reaction.ctx;

	try {
		var result = /** @type {Function} */ (0, reaction.fn)();
		var deps = reaction.deps;

		if (new_deps !== null) {
			var i;

			remove_reactions(reaction, skipped_deps);

			if (deps !== null && skipped_deps > 0) {
				deps.length = skipped_deps + new_deps.length;
				for (i = 0; i < new_deps.length; i++) {
					deps[skipped_deps + i] = new_deps[i];
				}
			} else {
				reaction.deps = deps = new_deps;
			}

			if (!skip_reaction) {
				for (i = skipped_deps; i < deps.length; i++) {
					(deps[i].reactions ??= []).push(reaction);
				}
			}
		} else if (deps !== null && skipped_deps < deps.length) {
			remove_reactions(reaction, skipped_deps);
			deps.length = skipped_deps;
		}

		return result;
	} finally {
		new_deps = previous_deps;
		skipped_deps = previous_skipped_deps;
		untracked_writes = previous_untracked_writes;
		active_reaction = previous_reaction;
		skip_reaction = previous_skip_reaction;
		derived_sources = prev_derived_sources;
		component_context = previous_component_context;
	}
}

/**
 * @template V
 * @param {Reaction} signal
 * @param {Value<V>} dependency
 * @returns {void}
 */
function remove_reaction(signal, dependency) {
	let reactions = dependency.reactions;
	if (reactions !== null) {
		var index = reactions.indexOf(signal);
		if (index !== -1) {
			var new_length = reactions.length - 1;
			if (new_length === 0) {
				reactions = dependency.reactions = null;
			} else {
				// Swap with last element and then remove.
				reactions[index] = reactions[new_length];
				reactions.pop();
			}
		}
	}
	// If the derived has no reactions, then we can disconnect it from the graph,
	// allowing it to either reconnect in the future, or be GC'd by the VM.
	if (
		reactions === null &&
		(dependency.f & DERIVED) !== 0 &&
		// Destroying a child effect while updating a parent effect can cause a dependency to appear
		// to be unused, when in fact it is used by the currently-updating parent. Checking `new_deps`
		// allows us to skip the expensive work of disconnecting and immediately reconnecting it
		(new_deps === null || !new_deps.includes(dependency))
	) {
		set_signal_status(dependency, MAYBE_DIRTY);
		// If we are working with a derived that is owned by an effect, then mark it as being
		// disconnected.
		if ((dependency.f & (UNOWNED | DISCONNECTED)) === 0) {
			dependency.f ^= DISCONNECTED;
		}
		remove_reactions(/** @type {Derived} **/ (dependency), 0);
	}
}

/**
 * @param {Reaction} signal
 * @param {number} start_index
 * @returns {void}
 */
function remove_reactions(signal, start_index) {
	var dependencies = signal.deps;
	if (dependencies === null) return;

	for (var i = start_index; i < dependencies.length; i++) {
		remove_reaction(signal, dependencies[i]);
	}
}

/**
 * @param {Effect} effect
 * @returns {void}
 */
function update_effect(effect) {
	var flags = effect.f;

	if ((flags & DESTROYED) !== 0) {
		return;
	}

	set_signal_status(effect, CLEAN);

	var previous_effect = active_effect;
	var previous_component_context = component_context;

	active_effect = effect;

	if (DEV) {
		var previous_component_fn = dev_current_component_function;
		dev_current_component_function = effect.component_function;
	}

	try {
		if ((flags & BLOCK_EFFECT) !== 0) {
			destroy_block_effect_children(effect);
		} else {
			destroy_effect_children(effect);
		}
		destroy_effect_deriveds(effect);

		execute_effect_teardown(effect);
		var teardown = update_reaction(effect);
		effect.teardown = typeof teardown === 'function' ? teardown : null;
		effect.version = current_version;

		if (DEV) {
			dev_effect_stack.push(effect);
		}
	} catch (error) {
		handle_error(error, effect, previous_effect, previous_component_context || effect.ctx);
	} finally {
		active_effect = previous_effect;

		if (DEV) {
			dev_current_component_function = previous_component_fn;
		}
	}
}

function log_effect_stack() {
	// eslint-disable-next-line no-console
	console.error(
		'Last ten effects were: ',
		dev_effect_stack.slice(-10).map((d) => d.fn)
	);
	dev_effect_stack = [];
}

function infinite_loop_guard() {
	if (flush_count > 1000) {
		flush_count = 0;
		try {
			effect_update_depth_exceeded();
		} catch (error) {
			if (DEV) {
				// stack is garbage, ignore. Instead add a console.error message.
				define_property(error, 'stack', {
					value: ''
				});
			}
			// Try and handle the error so it can be caught at a boundary, that's
			// if there's an effect available from when it was last scheduled
			if (last_scheduled_effect !== null) {
				if (DEV) {
					try {
						handle_error(error, last_scheduled_effect, null, null);
					} catch (e) {
						// Only log the effect stack if the error is re-thrown
						log_effect_stack();
						throw e;
					}
				} else {
					handle_error(error, last_scheduled_effect, null, null);
				}
			} else {
				if (DEV) {
					log_effect_stack();
				}
				throw error;
			}
		}
	}
	flush_count++;
}

/**
 * @param {Array<Effect>} root_effects
 * @returns {void}
 */
function flush_queued_root_effects(root_effects) {
	var length = root_effects.length;
	if (length === 0) {
		return;
	}
	infinite_loop_guard();

	var previously_flushing_effect = is_flushing_effect;
	is_flushing_effect = true;

	try {
		for (var i = 0; i < length; i++) {
			var effect = root_effects[i];

			if ((effect.f & CLEAN) === 0) {
				effect.f ^= CLEAN;
			}

			/** @type {Effect[]} */
			var collected_effects = [];

			process_effects(effect, collected_effects);
			flush_queued_effects(collected_effects);
		}
	} finally {
		is_flushing_effect = previously_flushing_effect;
	}
}

/**
 * @param {Array<Effect>} effects
 * @returns {void}
 */
function flush_queued_effects(effects) {
	var length = effects.length;
	if (length === 0) return;

	for (var i = 0; i < length; i++) {
		var effect = effects[i];

		if ((effect.f & (DESTROYED | INERT)) === 0) {
			try {
				if (check_dirtiness(effect)) {
					update_effect(effect);

					// Effects with no dependencies or teardown do not get added to the effect tree.
					// Deferred effects (e.g. `$effect(...)`) _are_ added to the tree because we
					// don't know if we need to keep them until they are executed. Doing the check
					// here (rather than in `update_effect`) allows us to skip the work for
					// immediate effects.
					if (effect.deps === null && effect.first === null && effect.nodes_start === null) {
						if (effect.teardown === null) {
							// remove this effect from the graph
							unlink_effect(effect);
						} else {
							// keep the effect in the graph, but free up some memory
							effect.fn = null;
						}
					}
				}
			} catch (error) {
				handle_error(error, effect, null, effect.ctx);
			}
		}
	}
}

function process_deferred() {
	is_micro_task_queued = false;
	if (flush_count > 1001) {
		return;
	}
	const previous_queued_root_effects = queued_root_effects;
	queued_root_effects = [];
	flush_queued_root_effects(previous_queued_root_effects);

	if (!is_micro_task_queued) {
		flush_count = 0;
		last_scheduled_effect = null;
		if (DEV) {
			dev_effect_stack = [];
		}
	}
}

/**
 * @param {Effect} signal
 * @returns {void}
 */
function schedule_effect(signal) {
	if (scheduler_mode === FLUSH_MICROTASK) {
		if (!is_micro_task_queued) {
			is_micro_task_queued = true;
			queueMicrotask(process_deferred);
		}
	}

	last_scheduled_effect = signal;

	var effect = signal;

	while (effect.parent !== null) {
		effect = effect.parent;
		var flags = effect.f;

		if ((flags & (ROOT_EFFECT | BRANCH_EFFECT)) !== 0) {
			if ((flags & CLEAN) === 0) return;
			effect.f ^= CLEAN;
		}
	}

	queued_root_effects.push(effect);
}

/**
 *
 * This function both runs render effects and collects user effects in topological order
 * from the starting effect passed in. Effects will be collected when they match the filtered
 * bitwise flag passed in only. The collected effects array will be populated with all the user
 * effects to be flushed.
 *
 * @param {Effect} effect
 * @param {Effect[]} collected_effects
 * @returns {void}
 */
function process_effects(effect, collected_effects) {
	var current_effect = effect.first;
	var effects = [];

	main_loop: while (current_effect !== null) {
		var flags = current_effect.f;
		var is_branch = (flags & BRANCH_EFFECT) !== 0;
		var is_skippable_branch = is_branch && (flags & CLEAN) !== 0;
		var sibling = current_effect.next;

		if (!is_skippable_branch && (flags & INERT) === 0) {
			if ((flags & RENDER_EFFECT) !== 0) {
				if (is_branch) {
					current_effect.f ^= CLEAN;
				} else {
					try {
						if (check_dirtiness(current_effect)) {
							update_effect(current_effect);
						}
					} catch (error) {
						handle_error(error, current_effect, null, current_effect.ctx);
					}
				}

				var child = current_effect.first;

				if (child !== null) {
					current_effect = child;
					continue;
				}
			} else if ((flags & EFFECT) !== 0) {
				effects.push(current_effect);
			}
		}

		if (sibling === null) {
			let parent = current_effect.parent;

			while (parent !== null) {
				if (effect === parent) {
					break main_loop;
				}
				var parent_sibling = parent.next;
				if (parent_sibling !== null) {
					current_effect = parent_sibling;
					continue main_loop;
				}
				parent = parent.parent;
			}
		}

		current_effect = sibling;
	}

	// We might be dealing with many effects here, far more than can be spread into
	// an array push call (callstack overflow). So let's deal with each effect in a loop.
	for (var i = 0; i < effects.length; i++) {
		child = effects[i];
		collected_effects.push(child);
		process_effects(child, collected_effects);
	}
}

/**
 * Internal version of `flushSync` with the option to not flush previous effects.
 * Returns the result of the passed function, if given.
 * @param {() => any} [fn]
 * @returns {any}
 */
function flush_sync(fn) {
	var previous_scheduler_mode = scheduler_mode;
	var previous_queued_root_effects = queued_root_effects;

	try {
		infinite_loop_guard();

		/** @type {Effect[]} */
		const root_effects = [];

		scheduler_mode = FLUSH_SYNC;
		queued_root_effects = root_effects;
		is_micro_task_queued = false;

		flush_queued_root_effects(previous_queued_root_effects);

		var result = fn?.();

		flush_tasks();
		if (queued_root_effects.length > 0 || root_effects.length > 0) {
			flush_sync();
		}

		flush_count = 0;
		last_scheduled_effect = null;
		if (DEV) {
			dev_effect_stack = [];
		}

		return result;
	} finally {
		scheduler_mode = previous_scheduler_mode;
		queued_root_effects = previous_queued_root_effects;
	}
}

/**
 * @template V
 * @param {Value<V>} signal
 * @returns {V}
 */
function get(signal) {
	var flags = signal.f;
	var is_derived = (flags & DERIVED) !== 0;

	// If the derived is destroyed, just execute it again without retaining
	// its memoisation properties as the derived is stale
	if (is_derived && (flags & DESTROYED) !== 0) {
		var value = execute_derived(/** @type {Derived} */ (signal));
		// Ensure the derived remains destroyed
		destroy_derived(/** @type {Derived} */ (signal));
		return value;
	}

	// Register the dependency on the current reaction signal.
	if (active_reaction !== null) {
		if (derived_sources !== null && derived_sources.includes(signal)) {
			state_unsafe_local_read();
		}
		var deps = active_reaction.deps;

		// If the signal is accessing the same dependencies in the same
		// order as it did last time, increment `skipped_deps`
		// rather than updating `new_deps`, which creates GC cost
		if (new_deps === null && deps !== null && deps[skipped_deps] === signal) {
			skipped_deps++;
		} else if (new_deps === null) {
			new_deps = [signal];
		} else {
			new_deps.push(signal);
		}

		if (
			untracked_writes !== null &&
			active_effect !== null &&
			(active_effect.f & CLEAN) !== 0 &&
			(active_effect.f & BRANCH_EFFECT) === 0 &&
			untracked_writes.includes(signal)
		) {
			set_signal_status(active_effect, DIRTY);
			schedule_effect(active_effect);
		}
	} else if (is_derived && /** @type {Derived} */ (signal).deps === null) {
		var derived = /** @type {Derived} */ (signal);
		var parent = derived.parent;
		var target = derived;

		while (parent !== null) {
			// Attach the derived to the nearest parent effect, if there are deriveds
			// in between then we also need to attach them too
			if ((parent.f & DERIVED) !== 0) {
				var parent_derived = /** @type {Derived} */ (parent);

				target = parent_derived;
				parent = parent_derived.parent;
			} else {
				var parent_effect = /** @type {Effect} */ (parent);

				if (!parent_effect.deriveds?.includes(target)) {
					(parent_effect.deriveds ??= []).push(target);
				}
				break;
			}
		}
	}

	if (is_derived) {
		derived = /** @type {Derived} */ (signal);

		if (check_dirtiness(derived)) {
			update_derived(derived);
		}
	}

	if (
		DEV &&
		tracing_mode_flag &&
		tracing_expressions !== null &&
		active_reaction !== null &&
		tracing_expressions.reaction === active_reaction
	) {
		// Used when mapping state between special blocks like `each`
		if (signal.debug) {
			signal.debug();
		} else if (signal.created) {
			var entry = tracing_expressions.entries.get(signal);

			if (entry === undefined) {
				entry = { read: [] };
				tracing_expressions.entries.set(signal, entry);
			}

			entry.read.push(get_stack$1('TracedAt'));
		}
	}

	return signal.v;
}

/**
 * When used inside a [`$derived`](https://svelte.dev/docs/svelte/$derived) or [`$effect`](https://svelte.dev/docs/svelte/$effect),
 * any state read inside `fn` will not be treated as a dependency.
 *
 * ```ts
 * $effect(() => {
 *   // this will run when `data` changes, but not when `time` changes
 *   save(data, {
 *     timestamp: untrack(() => time)
 *   });
 * });
 * ```
 * @template T
 * @param {() => T} fn
 * @returns {T}
 */
function untrack(fn) {
	const previous_reaction = active_reaction;
	try {
		active_reaction = null;
		return fn();
	} finally {
		active_reaction = previous_reaction;
	}
}

const STATUS_MASK = ~(DIRTY | MAYBE_DIRTY | CLEAN);

/**
 * @param {Signal} signal
 * @param {number} status
 * @returns {void}
 */
function set_signal_status(signal, status) {
	signal.f = (signal.f & STATUS_MASK) | status;
}

/**
 * @template {number | bigint} T
 * @param {Value<T>} signal
 * @param {1 | -1} [d]
 * @returns {T}
 */
function update(signal, d = 1) {
	var value = get(signal);
	var result = d === 1 ? value++ : value--;

	set(signal, value);

	// @ts-expect-error
	return result;
}

/**
 * @param {Record<string, unknown>} props
 * @param {any} runes
 * @param {Function} [fn]
 * @returns {void}
 */
function push(props, runes = false, fn) {
	component_context = {
		p: component_context,
		c: null,
		e: null,
		m: false,
		s: props,
		x: null,
		l: null
	};

	if (legacy_mode_flag && !runes) {
		component_context.l = {
			s: null,
			u: null,
			r1: [],
			r2: source(false)
		};
	}

	if (DEV) {
		// component function
		component_context.function = fn;
		dev_current_component_function = fn;
	}
}

/**
 * @template {Record<string, any>} T
 * @param {T} [component]
 * @returns {T}
 */
function pop(component) {
	const context_stack_item = component_context;
	if (context_stack_item !== null) {
		if (component !== undefined) {
			context_stack_item.x = component;
		}
		const component_effects = context_stack_item.e;
		if (component_effects !== null) {
			var previous_effect = active_effect;
			var previous_reaction = active_reaction;
			context_stack_item.e = null;
			try {
				for (var i = 0; i < component_effects.length; i++) {
					var component_effect = component_effects[i];
					set_active_effect(component_effect.effect);
					set_active_reaction(component_effect.reaction);
					effect(component_effect.fn);
				}
			} finally {
				set_active_effect(previous_effect);
				set_active_reaction(previous_reaction);
			}
		}
		component_context = context_stack_item.p;
		if (DEV) {
			dev_current_component_function = context_stack_item.p?.function ?? null;
		}
		context_stack_item.m = true;
	}
	// Micro-optimization: Don't set .a above to the empty object
	// so it can be garbage-collected when the return here is unused
	return component || /** @type {T} */ ({});
}

if (DEV) {
	/**
	 * @param {string} rune
	 */
	function throw_rune_error(rune) {
		if (!(rune in globalThis)) {
			// TODO if people start adjusting the "this can contain runes" config through v-p-s more, adjust this message
			/** @type {any} */
			let value; // let's hope noone modifies this global, but belts and braces
			Object.defineProperty(globalThis, rune, {
				configurable: true,
				// eslint-disable-next-line getter-return
				get: () => {
					if (value !== undefined) {
						return value;
					}

					rune_outside_svelte(rune);
				},
				set: (v) => {
					value = v;
				}
			});
		}
	}

	throw_rune_error('$state');
	throw_rune_error('$effect');
	throw_rune_error('$derived');
	throw_rune_error('$inspect');
	throw_rune_error('$props');
	throw_rune_error('$bindable');
}

/**
 * @param {string} name
 */
function is_capture_event(name) {
	return name.endsWith('capture') && name !== 'gotpointercapture' && name !== 'lostpointercapture';
}

/** List of Element events that will be delegated */
const DELEGATED_EVENTS = [
	'beforeinput',
	'click',
	'change',
	'dblclick',
	'contextmenu',
	'focusin',
	'focusout',
	'input',
	'keydown',
	'keyup',
	'mousedown',
	'mousemove',
	'mouseout',
	'mouseover',
	'mouseup',
	'pointerdown',
	'pointermove',
	'pointerout',
	'pointerover',
	'pointerup',
	'touchend',
	'touchmove',
	'touchstart'
];

/**
 * Returns `true` if `event_name` is a delegated event
 * @param {string} event_name
 */
function is_delegated(event_name) {
	return DELEGATED_EVENTS.includes(event_name);
}

/**
 * @type {Record<string, string>}
 * List of attribute names that should be aliased to their property names
 * because they behave differently between setting them as an attribute and
 * setting them as a property.
 */
const ATTRIBUTE_ALIASES = {
	// no `class: 'className'` because we handle that separately
	formnovalidate: 'formNoValidate',
	ismap: 'isMap',
	nomodule: 'noModule',
	playsinline: 'playsInline',
	readonly: 'readOnly',
	defaultvalue: 'defaultValue',
	defaultchecked: 'defaultChecked',
	srcobject: 'srcObject'
};

/**
 * @param {string} name
 */
function normalize_attribute(name) {
	name = name.toLowerCase();
	return ATTRIBUTE_ALIASES[name] ?? name;
}

/**
 * Subset of delegated events which should be passive by default.
 * These two are already passive via browser defaults on window, document and body.
 * But since
 * - we're delegating them
 * - they happen often
 * - they apply to mobile which is generally less performant
 * we're marking them as passive by default for other elements, too.
 */
const PASSIVE_EVENTS = ['touchstart', 'touchmove'];

/**
 * Returns `true` if `name` is a passive event
 * @param {string} name
 */
function is_passive_event(name) {
	return PASSIVE_EVENTS.includes(name);
}

/** @import { SourceLocation } from '#shared' */

/**
 * @param {any} fn
 * @param {string} filename
 * @param {SourceLocation[]} locations
 * @returns {any}
 */
function add_locations(fn, filename, locations) {
	return (/** @type {any[]} */ ...args) => {
		const dom = fn(...args);

		var node = dom.nodeType === 11 ? dom.firstChild : dom;
		assign_locations(node, filename, locations);

		return dom;
	};
}

/**
 * @param {Element} element
 * @param {string} filename
 * @param {SourceLocation} location
 */
function assign_location(element, filename, location) {
	// @ts-expect-error
	element.__svelte_meta = {
		loc: { file: filename, line: location[0], column: location[1] }
	};

	if (location[2]) {
		assign_locations(element.firstChild, filename, location[2]);
	}
}

/**
 * @param {Node | null} node
 * @param {string} filename
 * @param {SourceLocation[]} locations
 */
function assign_locations(node, filename, locations) {
	var i = 0;

	while (node && i < locations.length) {

		if (node.nodeType === 1) {
			assign_location(/** @type {Element} */ (node), filename, locations[i++]);
		}

		node = node.nextSibling;
	}
}

/**
 * @param {HTMLElement} dom
 * @param {boolean} value
 * @returns {void}
 */
function autofocus(dom, value) {
	if (value) {
		const body = document.body;
		dom.autofocus = true;

		queue_micro_task(() => {
			if (document.activeElement === body) {
				dom.focus();
			}
		});
	}
}

/**
 * @template T
 * @param {() => T} fn
 */
function without_reactive_context(fn) {
	var previous_reaction = active_reaction;
	var previous_effect = active_effect;
	set_active_reaction(null);
	set_active_effect(null);
	try {
		return fn();
	} finally {
		set_active_reaction(previous_reaction);
		set_active_effect(previous_effect);
	}
}

/** @import { Location } from 'locate-character' */

/** @type {Set<string>} */
const all_registered_events = new Set();

/** @type {Set<(events: Array<string>) => void>} */
const root_event_handles = new Set();

/**
 * @param {string} event_name
 * @param {EventTarget} dom
 * @param {EventListener} handler
 * @param {AddEventListenerOptions} options
 */
function create_event(event_name, dom, handler, options) {
	/**
	 * @this {EventTarget}
	 */
	function target_handler(/** @type {Event} */ event) {
		if (!options.capture) {
			// Only call in the bubble phase, else delegated events would be called before the capturing events
			handle_event_propagation.call(dom, event);
		}
		if (!event.cancelBubble) {
			return without_reactive_context(() => {
				return handler.call(this, event);
			});
		}
	}

	// Chrome has a bug where pointer events don't work when attached to a DOM element that has been cloned
	// with cloneNode() and the DOM element is disconnected from the document. To ensure the event works, we
	// defer the attachment till after it's been appended to the document. TODO: remove this once Chrome fixes
	// this bug. The same applies to wheel events and touch events.
	if (
		event_name.startsWith('pointer') ||
		event_name.startsWith('touch') ||
		event_name === 'wheel'
	) {
		queue_micro_task(() => {
			dom.addEventListener(event_name, target_handler, options);
		});
	} else {
		dom.addEventListener(event_name, target_handler, options);
	}

	return target_handler;
}

/**
 * @param {Array<string>} events
 * @returns {void}
 */
function delegate(events) {
	for (var i = 0; i < events.length; i++) {
		all_registered_events.add(events[i]);
	}

	for (var fn of root_event_handles) {
		fn(events);
	}
}

/**
 * @this {EventTarget}
 * @param {Event} event
 * @returns {void}
 */
function handle_event_propagation(event) {
	var handler_element = this;
	var owner_document = /** @type {Node} */ (handler_element).ownerDocument;
	var event_name = event.type;
	var path = event.composedPath?.() || [];
	var current_target = /** @type {null | Element} */ (path[0] || event.target);

	// composedPath contains list of nodes the event has propagated through.
	// We check __root to skip all nodes below it in case this is a
	// parent of the __root node, which indicates that there's nested
	// mounted apps. In this case we don't want to trigger events multiple times.
	var path_idx = 0;

	// @ts-expect-error is added below
	var handled_at = event.__root;

	if (handled_at) {
		var at_idx = path.indexOf(handled_at);
		if (
			at_idx !== -1 &&
			(handler_element === document || handler_element === /** @type {any} */ (window))
		) {
			// This is the fallback document listener or a window listener, but the event was already handled
			// -> ignore, but set handle_at to document/window so that we're resetting the event
			// chain in case someone manually dispatches the same event object again.
			// @ts-expect-error
			event.__root = handler_element;
			return;
		}

		// We're deliberately not skipping if the index is higher, because
		// someone could create an event programmatically and emit it multiple times,
		// in which case we want to handle the whole propagation chain properly each time.
		// (this will only be a false negative if the event is dispatched multiple times and
		// the fallback document listener isn't reached in between, but that's super rare)
		var handler_idx = path.indexOf(handler_element);
		if (handler_idx === -1) {
			// handle_idx can theoretically be -1 (happened in some JSDOM testing scenarios with an event listener on the window object)
			// so guard against that, too, and assume that everything was handled at this point.
			return;
		}

		if (at_idx <= handler_idx) {
			path_idx = at_idx;
		}
	}

	current_target = /** @type {Element} */ (path[path_idx] || event.target);
	// there can only be one delegated event per element, and we either already handled the current target,
	// or this is the very first target in the chain which has a non-delegated listener, in which case it's safe
	// to handle a possible delegated event on it later (through the root delegation listener for example).
	if (current_target === handler_element) return;

	// Proxy currentTarget to correct target
	define_property(event, 'currentTarget', {
		configurable: true,
		get() {
			return current_target || owner_document;
		}
	});

	// This started because of Chromium issue https://chromestatus.com/feature/5128696823545856,
	// where removal or moving of of the DOM can cause sync `blur` events to fire, which can cause logic
	// to run inside the current `active_reaction`, which isn't what we want at all. However, on reflection,
	// it's probably best that all event handled by Svelte have this behaviour, as we don't really want
	// an event handler to run in the context of another reaction or effect.
	var previous_reaction = active_reaction;
	var previous_effect = active_effect;
	set_active_reaction(null);
	set_active_effect(null);

	try {
		/**
		 * @type {unknown}
		 */
		var throw_error;
		/**
		 * @type {unknown[]}
		 */
		var other_errors = [];

		while (current_target !== null) {
			/** @type {null | Element} */
			var parent_element =
				current_target.assignedSlot ||
				current_target.parentNode ||
				/** @type {any} */ (current_target).host ||
				null;

			try {
				// @ts-expect-error
				var delegated = current_target['__' + event_name];

				if (delegated !== undefined && !(/** @type {any} */ (current_target).disabled)) {
					if (is_array(delegated)) {
						var [fn, ...data] = delegated;
						fn.apply(current_target, [event, ...data]);
					} else {
						delegated.call(current_target, event);
					}
				}
			} catch (error) {
				if (throw_error) {
					other_errors.push(error);
				} else {
					throw_error = error;
				}
			}
			if (event.cancelBubble || parent_element === handler_element || parent_element === null) {
				break;
			}
			current_target = parent_element;
		}

		if (throw_error) {
			for (let error of other_errors) {
				// Throw the rest of the errors, one-by-one on a microtask
				queueMicrotask(() => {
					throw error;
				});
			}
			throw throw_error;
		}
	} finally {
		// @ts-expect-error is used above
		event.__root = handler_element;
		// @ts-ignore remove proxy on currentTarget
		delete event.currentTarget;
		set_active_reaction(previous_reaction);
		set_active_effect(previous_effect);
	}
}

/** @param {string} html */
function create_fragment_from_html(html) {
	var elem = document.createElement('template');
	elem.innerHTML = html;
	return elem.content;
}

/** @import { Effect, TemplateNode } from '#client' */

/**
 * @param {TemplateNode} start
 * @param {TemplateNode | null} end
 */
function assign_nodes(start, end) {
	var effect = /** @type {Effect} */ (active_effect);
	if (effect.nodes_start === null) {
		effect.nodes_start = start;
		effect.nodes_end = end;
	}
}

/**
 * @param {string} content
 * @param {number} flags
 * @returns {() => Node | Node[]}
 */
/*#__NO_SIDE_EFFECTS__*/
function template(content, flags) {
	var is_fragment = (flags & TEMPLATE_FRAGMENT) !== 0;
	var use_import_node = (flags & TEMPLATE_USE_IMPORT_NODE) !== 0;

	/** @type {Node} */
	var node;

	/**
	 * Whether or not the first item is a text/element node. If not, we need to
	 * create an additional comment node to act as `effect.nodes.start`
	 */
	var has_start = !content.startsWith('<!>');

	return () => {

		if (node === undefined) {
			node = create_fragment_from_html(has_start ? content : '<!>' + content);
			if (!is_fragment) node = /** @type {Node} */ (get_first_child(node));
		}

		var clone = /** @type {TemplateNode} */ (
			use_import_node ? document.importNode(node, true) : node.cloneNode(true)
		);

		if (is_fragment) {
			var start = /** @type {TemplateNode} */ (get_first_child(clone));
			var end = /** @type {TemplateNode} */ (clone.lastChild);

			assign_nodes(start, end);
		} else {
			assign_nodes(clone, clone);
		}

		return clone;
	};
}

/**
 * Don't mark this as side-effect-free, hydration needs to walk all nodes
 * @param {any} value
 */
function text(value = '') {
	{
		var t = create_text(value + '');
		assign_nodes(t, t);
		return t;
	}
}

function comment() {

	var frag = document.createDocumentFragment();
	var start = document.createComment('');
	var anchor = create_text();
	frag.append(start, anchor);

	assign_nodes(start, anchor);

	return frag;
}

/**
 * Assign the created (or in hydration mode, traversed) dom elements to the current block
 * and insert the elements into the dom (in client mode).
 * @param {Text | Comment | Element} anchor
 * @param {DocumentFragment | Element} dom
 */
function append(anchor, dom) {

	if (anchor === null) {
		// edge case — void `<svelte:element>` with content
		return;
	}

	anchor.before(/** @type {Node} */ (dom));
}

/** @import { ComponentContext, Effect, TemplateNode } from '#client' */
/** @import { Component, ComponentType, SvelteComponent, MountOptions } from '../../index.js' */

/**
 * @param {Element} text
 * @param {string} value
 * @returns {void}
 */
function set_text(text, value) {
	// For objects, we apply string coercion (which might make things like $state array references in the template reactive) before diffing
	var str = value == null ? '' : typeof value === 'object' ? value + '' : value;
	// @ts-expect-error
	if (str !== (text.__t ??= text.nodeValue)) {
		// @ts-expect-error
		text.__t = str;
		text.nodeValue = str == null ? '' : str + '';
	}
}

/**
 * Mounts a component to the given target and returns the exports and potentially the props (if compiled with `accessors: true`) of the component.
 * Transitions will play during the initial render unless the `intro` option is set to `false`.
 *
 * @template {Record<string, any>} Props
 * @template {Record<string, any>} Exports
 * @param {ComponentType<SvelteComponent<Props>> | Component<Props, Exports, any>} component
 * @param {MountOptions<Props>} options
 * @returns {Exports}
 */
function mount(component, options) {
	return _mount(component, options);
}

/** @type {Map<string, number>} */
const document_listeners = new Map();

/**
 * @template {Record<string, any>} Exports
 * @param {ComponentType<SvelteComponent<any>> | Component<any>} Component
 * @param {MountOptions} options
 * @returns {Exports}
 */
function _mount(Component, { target, anchor, props = {}, events, context, intro = true }) {
	init_operations();

	var registered_events = new Set();

	/** @param {Array<string>} events */
	var event_handle = (events) => {
		for (var i = 0; i < events.length; i++) {
			var event_name = events[i];

			if (registered_events.has(event_name)) continue;
			registered_events.add(event_name);

			var passive = is_passive_event(event_name);

			// Add the event listener to both the container and the document.
			// The container listener ensures we catch events from within in case
			// the outer content stops propagation of the event.
			target.addEventListener(event_name, handle_event_propagation, { passive });

			var n = document_listeners.get(event_name);

			if (n === undefined) {
				// The document listener ensures we catch events that originate from elements that were
				// manually moved outside of the container (e.g. via manual portals).
				document.addEventListener(event_name, handle_event_propagation, { passive });
				document_listeners.set(event_name, 1);
			} else {
				document_listeners.set(event_name, n + 1);
			}
		}
	};

	event_handle(array_from(all_registered_events));
	root_event_handles.add(event_handle);

	/** @type {Exports} */
	// @ts-expect-error will be defined because the render effect runs synchronously
	var component = undefined;

	var unmount = component_root(() => {
		var anchor_node = anchor ?? target.appendChild(create_text());

		branch(() => {
			if (context) {
				push({});
				var ctx = /** @type {ComponentContext} */ (component_context);
				ctx.c = context;
			}

			if (events) {
				// We can't spread the object or else we'd lose the state proxy stuff, if it is one
				/** @type {any} */ (props).$$events = events;
			}
			// @ts-expect-error the public typings are not what the actual function looks like
			component = Component(anchor_node, props) || {};

			if (context) {
				pop();
			}
		});

		return () => {
			for (var event_name of registered_events) {
				target.removeEventListener(event_name, handle_event_propagation);

				var n = /** @type {number} */ (document_listeners.get(event_name));

				if (--n === 0) {
					document.removeEventListener(event_name, handle_event_propagation);
					document_listeners.delete(event_name);
				} else {
					document_listeners.set(event_name, n);
				}
			}

			root_event_handles.delete(event_handle);

			if (anchor_node !== anchor) {
				anchor_node.parentNode?.removeChild(anchor_node);
			}
		};
	});

	mounted_components.set(component, unmount);
	return component;
}

/**
 * References of the components that were mounted or hydrated.
 * Uses a `WeakMap` to avoid memory leaks.
 */
let mounted_components = new WeakMap();

/** @param {Function & { [FILENAME]: string }} target */
function check_target(target) {
	if (target) {
		component_api_invalid_new(target[FILENAME] ?? 'a component', target.name);
	}
}

function legacy_api() {
	const component = component_context?.function;

	/** @param {string} method */
	function error(method) {
		// @ts-expect-error
		const parent = get_component()?.[FILENAME] ?? 'Something';
		component_api_changed(parent, method, component[FILENAME]);
	}

	return {
		$destroy: () => error('$destroy()'),
		$on: () => error('$on(...)'),
		$set: () => error('$set(...)')
	};
}

/** @import { Effect, Source, TemplateNode } from '#client' */

const PENDING = 0;
const THEN = 1;
const CATCH = 2;

/**
 * @template V
 * @param {TemplateNode} node
 * @param {(() => Promise<V>)} get_input
 * @param {null | ((anchor: Node) => void)} pending_fn
 * @param {null | ((anchor: Node, value: Source<V>) => void)} then_fn
 * @param {null | ((anchor: Node, error: unknown) => void)} catch_fn
 * @returns {void}
 */
function await_block(node, get_input, pending_fn, then_fn, catch_fn) {

	var anchor = node;
	var runes = is_runes();
	var active_component_context = component_context;

	/** @type {any} */
	var component_function = DEV ? component_context?.function : null;

	/** @type {V | Promise<V> | typeof UNINITIALIZED} */
	var input = UNINITIALIZED;

	/** @type {Effect | null} */
	var pending_effect;

	/** @type {Effect | null} */
	var then_effect;

	/** @type {Effect | null} */
	var catch_effect;

	var input_source = (runes ? source : mutable_source)(/** @type {V} */ (undefined));
	var error_source = (runes ? source : mutable_source)(undefined);
	var resolved = false;

	/**
	 * @param {PENDING | THEN | CATCH} state
	 * @param {boolean} restore
	 */
	function update(state, restore) {
		resolved = true;

		if (restore) {
			set_active_effect(effect);
			set_active_reaction(effect); // TODO do we need both?
			set_component_context(active_component_context);
			if (DEV) set_dev_current_component_function(component_function);
		}

		try {
			if (state === PENDING && pending_fn) {
				if (pending_effect) resume_effect(pending_effect);
				else pending_effect = branch(() => pending_fn(anchor));
			}

			if (state === THEN && then_fn) {
				if (then_effect) resume_effect(then_effect);
				else then_effect = branch(() => then_fn(anchor, input_source));
			}

			if (state === CATCH && catch_fn) {
				if (catch_effect) resume_effect(catch_effect);
				else catch_effect = branch(() => catch_fn(anchor, error_source));
			}

			if (state !== PENDING && pending_effect) {
				pause_effect(pending_effect, () => (pending_effect = null));
			}

			if (state !== THEN && then_effect) {
				pause_effect(then_effect, () => (then_effect = null));
			}

			if (state !== CATCH && catch_effect) {
				pause_effect(catch_effect, () => (catch_effect = null));
			}
		} finally {
			if (restore) {
				if (DEV) set_dev_current_component_function(null);
				set_component_context(null);
				set_active_reaction(null);
				set_active_effect(null);

				// without this, the DOM does not update until two ticks after the promise
				// resolves, which is unexpected behaviour (and somewhat irksome to test)
				flush_sync();
			}
		}
	}

	var effect = block(() => {
		if (input === (input = get_input())) return;

		if (is_promise(input)) {
			var promise = input;

			resolved = false;

			promise.then(
				(value) => {
					if (promise !== input) return;
					// we technically could use `set` here since it's on the next microtick
					// but let's use internal_set for consistency and just to be safe
					internal_set(input_source, value);
					update(THEN, true);
				},
				(error) => {
					if (promise !== input) return;
					// we technically could use `set` here since it's on the next microtick
					// but let's use internal_set for consistency and just to be safe
					internal_set(error_source, error);
					update(CATCH, true);
					if (!catch_fn) {
						// Rethrow the error if no catch block exists
						throw error_source.v;
					}
				}
			);

			{
				// Wait a microtask before checking if we should show the pending state as
				// the promise might have resolved by the next microtask.
				queue_micro_task(() => {
					if (!resolved) update(PENDING, true);
				});
			}
		} else {
			internal_set(input_source, input);
			update(THEN, false);
		}

		// Set the input to something else, in order to disable the promise callbacks
		return () => (input = UNINITIALIZED);
	});
}

/** @import { Effect, TemplateNode } from '#client' */

/**
 * @param {TemplateNode} node
 * @param {(branch: (fn: (anchor: Node) => void, flag?: boolean) => void) => void} fn
 * @param {boolean} [elseif] True if this is an `{:else if ...}` block rather than an `{#if ...}`, as that affects which transitions are considered 'local'
 * @returns {void}
 */
function if_block(node, fn, elseif = false) {

	var anchor = node;

	/** @type {Effect | null} */
	var consequent_effect = null;

	/** @type {Effect | null} */
	var alternate_effect = null;

	/** @type {UNINITIALIZED | boolean | null} */
	var condition = UNINITIALIZED;

	var flags = elseif ? EFFECT_TRANSPARENT : 0;

	var has_branch = false;

	const set_branch = (/** @type {(anchor: Node) => void} */ fn, flag = true) => {
		has_branch = true;
		update_branch(flag, fn);
	};

	const update_branch = (
		/** @type {boolean | null} */ new_condition,
		/** @type {null | ((anchor: Node) => void)} */ fn
	) => {
		if (condition === (condition = new_condition)) return;

		if (condition) {
			if (consequent_effect) {
				resume_effect(consequent_effect);
			} else if (fn) {
				consequent_effect = branch(() => fn(anchor));
			}

			if (alternate_effect) {
				pause_effect(alternate_effect, () => {
					alternate_effect = null;
				});
			}
		} else {
			if (alternate_effect) {
				resume_effect(alternate_effect);
			} else if (fn) {
				alternate_effect = branch(() => fn(anchor));
			}

			if (consequent_effect) {
				pause_effect(consequent_effect, () => {
					consequent_effect = null;
				});
			}
		}
	};

	block(() => {
		has_branch = false;
		fn(set_branch);
		if (!has_branch) {
			update_branch(null, null);
		}
	}, flags);
}

/** @import { EachItem, EachState, Effect, MaybeSource, Source, TemplateNode, TransitionManager, Value } from '#client' */

/**
 * @param {any} _
 * @param {number} i
 */
function index(_, i) {
	return i;
}

/**
 * Pause multiple effects simultaneously, and coordinate their
 * subsequent destruction. Used in each blocks
 * @param {EachState} state
 * @param {EachItem[]} items
 * @param {null | Node} controlled_anchor
 * @param {Map<any, EachItem>} items_map
 */
function pause_effects(state, items, controlled_anchor, items_map) {
	/** @type {TransitionManager[]} */
	var transitions = [];
	var length = items.length;

	for (var i = 0; i < length; i++) {
		pause_children(items[i].e, transitions, true);
	}

	var is_controlled = length > 0 && transitions.length === 0 && controlled_anchor !== null;
	// If we have a controlled anchor, it means that the each block is inside a single
	// DOM element, so we can apply a fast-path for clearing the contents of the element.
	if (is_controlled) {
		var parent_node = /** @type {Element} */ (
			/** @type {Element} */ (controlled_anchor).parentNode
		);
		clear_text_content(parent_node);
		parent_node.append(/** @type {Element} */ (controlled_anchor));
		items_map.clear();
		link(state, items[0].prev, items[length - 1].next);
	}

	run_out_transitions(transitions, () => {
		for (var i = 0; i < length; i++) {
			var item = items[i];
			if (!is_controlled) {
				items_map.delete(item.k);
				link(state, item.prev, item.next);
			}
			destroy_effect(item.e, !is_controlled);
		}
	});
}

/**
 * @template V
 * @param {Element | Comment} node The next sibling node, or the parent node if this is a 'controlled' block
 * @param {number} flags
 * @param {() => V[]} get_collection
 * @param {(value: V, index: number) => any} get_key
 * @param {(anchor: Node, item: MaybeSource<V>, index: MaybeSource<number>) => void} render_fn
 * @param {null | ((anchor: Node) => void)} fallback_fn
 * @returns {void}
 */
function each(node, flags, get_collection, get_key, render_fn, fallback_fn = null) {
	var anchor = node;

	/** @type {EachState} */
	var state = { flags, items: new Map(), first: null };

	{
		var parent_node = /** @type {Element} */ (node);

		anchor = parent_node.appendChild(create_text());
	}

	/** @type {Effect | null} */
	var fallback = null;

	var was_empty = false;

	block(() => {
		var collection = get_collection();

		var array = is_array(collection)
			? collection
			: collection == null
				? []
				: array_from(collection);

		var length = array.length;

		if (was_empty && length === 0) {
			// ignore updates if the array is empty,
			// and it already was empty on previous run
			return;
		}
		was_empty = length === 0;

		{
			var effect = /** @type {Effect} */ (active_reaction);
			reconcile(
				array,
				state,
				anchor,
				render_fn,
				flags,
				(effect.f & INERT) !== 0,
				get_key,
				get_collection
			);
		}

		if (fallback_fn !== null) {
			if (length === 0) {
				if (fallback) {
					resume_effect(fallback);
				} else {
					fallback = branch(() => fallback_fn(anchor));
				}
			} else if (fallback !== null) {
				pause_effect(fallback, () => {
					fallback = null;
				});
			}
		}

		// When we mount the each block for the first time, the collection won't be
		// connected to this effect as the effect hasn't finished running yet and its deps
		// won't be assigned. However, it's possible that when reconciling the each block
		// that a mutation occurred and it's made the collection MAYBE_DIRTY, so reading the
		// collection again can provide consistency to the reactive graph again as the deriveds
		// will now be `CLEAN`.
		get_collection();
	});
}

/**
 * Add, remove, or reorder items output by an each block as its input changes
 * @template V
 * @param {Array<V>} array
 * @param {EachState} state
 * @param {Element | Comment | Text} anchor
 * @param {(anchor: Node, item: MaybeSource<V>, index: number | Source<number>) => void} render_fn
 * @param {number} flags
 * @param {boolean} is_inert
 * @param {(value: V, index: number) => any} get_key
 * @param {() => V[]} get_collection
 * @returns {void}
 */
function reconcile(array, state, anchor, render_fn, flags, is_inert, get_key, get_collection) {

	var length = array.length;
	var items = state.items;
	var first = state.first;
	var current = first;

	/** @type {undefined | Set<EachItem>} */
	var seen;

	/** @type {EachItem | null} */
	var prev = null;

	/** @type {EachItem[]} */
	var matched = [];

	/** @type {EachItem[]} */
	var stashed = [];

	/** @type {V} */
	var value;

	/** @type {any} */
	var key;

	/** @type {EachItem | undefined} */
	var item;

	/** @type {number} */
	var i;

	for (i = 0; i < length; i += 1) {
		value = array[i];
		key = get_key(value, i);
		item = items.get(key);

		if (item === undefined) {
			var child_anchor = current ? /** @type {TemplateNode} */ (current.e.nodes_start) : anchor;

			prev = create_item(
				child_anchor,
				state,
				prev,
				prev === null ? state.first : prev.next,
				value,
				key,
				i,
				render_fn,
				flags,
				get_collection
			);

			items.set(key, prev);

			matched = [];
			stashed = [];

			current = prev.next;
			continue;
		}

		{
			update_item(item, value, i);
		}

		if ((item.e.f & INERT) !== 0) {
			resume_effect(item.e);
		}

		if (item !== current) {
			if (seen !== undefined && seen.has(item)) {
				if (matched.length < stashed.length) {
					// more efficient to move later items to the front
					var start = stashed[0];
					var j;

					prev = start.prev;

					var a = matched[0];
					var b = matched[matched.length - 1];

					for (j = 0; j < matched.length; j += 1) {
						move(matched[j], start, anchor);
					}

					for (j = 0; j < stashed.length; j += 1) {
						seen.delete(stashed[j]);
					}

					link(state, a.prev, b.next);
					link(state, prev, a);
					link(state, b, start);

					current = start;
					prev = b;
					i -= 1;

					matched = [];
					stashed = [];
				} else {
					// more efficient to move earlier items to the back
					seen.delete(item);
					move(item, current, anchor);

					link(state, item.prev, item.next);
					link(state, item, prev === null ? state.first : prev.next);
					link(state, prev, item);

					prev = item;
				}

				continue;
			}

			matched = [];
			stashed = [];

			while (current !== null && current.k !== key) {
				// If the each block isn't inert and an item has an effect that is already inert,
				// skip over adding it to our seen Set as the item is already being handled
				if (is_inert || (current.e.f & INERT) === 0) {
					(seen ??= new Set()).add(current);
				}
				stashed.push(current);
				current = current.next;
			}

			if (current === null) {
				continue;
			}

			item = current;
		}

		matched.push(item);
		prev = item;
		current = item.next;
	}

	if (current !== null || seen !== undefined) {
		var to_destroy = seen === undefined ? [] : array_from(seen);

		while (current !== null) {
			// If the each block isn't inert, then inert effects are currently outroing and will be removed once the transition is finished
			if (is_inert || (current.e.f & INERT) === 0) {
				to_destroy.push(current);
			}
			current = current.next;
		}

		var destroy_length = to_destroy.length;

		if (destroy_length > 0) {
			var controlled_anchor = length === 0 ? anchor : null;

			pause_effects(state, to_destroy, controlled_anchor, items);
		}
	}

	/** @type {Effect} */ (active_effect).first = state.first && state.first.e;
	/** @type {Effect} */ (active_effect).last = prev && prev.e;
}

/**
 * @param {EachItem} item
 * @param {any} value
 * @param {number} index
 * @param {number} type
 * @returns {void}
 */
function update_item(item, value, index, type) {
	{
		internal_set(item.v, value);
	}

	{
		item.i = index;
	}
}

/**
 * @template V
 * @param {Node} anchor
 * @param {EachState} state
 * @param {EachItem | null} prev
 * @param {EachItem | null} next
 * @param {V} value
 * @param {unknown} key
 * @param {number} index
 * @param {(anchor: Node, item: V | Source<V>, index: number | Value<number>) => void} render_fn
 * @param {number} flags
 * @param {() => V[]} get_collection
 * @returns {EachItem}
 */
function create_item(
	anchor,
	state,
	prev,
	next,
	value,
	key,
	index,
	render_fn,
	flags,
	get_collection
) {
	var reactive = (flags & EACH_ITEM_REACTIVE) !== 0;
	var mutable = (flags & EACH_ITEM_IMMUTABLE) === 0;

	var v = reactive ? (mutable ? mutable_source(value) : source(value)) : value;
	var i = (flags & EACH_INDEX_REACTIVE) === 0 ? index : source(index);

	if (DEV && reactive) {
		// For tracing purposes, we need to link the source signal we create with the
		// collection + index so that tracing works as intended
		/** @type {Value} */ (v).debug = () => {
			var collection_index = typeof i === 'number' ? index : i.v;
			// eslint-disable-next-line @typescript-eslint/no-unused-expressions
			get_collection()[collection_index];
		};
	}

	/** @type {EachItem} */
	var item = {
		i,
		v,
		k: key,
		a: null,
		// @ts-expect-error
		e: null,
		prev,
		next
	};

	try {
		item.e = branch(() => render_fn(anchor, v, i), hydrating);

		item.e.prev = prev && prev.e;
		item.e.next = next && next.e;

		if (prev === null) {
			state.first = item;
		} else {
			prev.next = item;
			prev.e.next = item.e;
		}

		if (next !== null) {
			next.prev = item;
			next.e.prev = item.e;
		}

		return item;
	} finally {
	}
}

/**
 * @param {EachItem} item
 * @param {EachItem | null} next
 * @param {Text | Element | Comment} anchor
 */
function move(item, next, anchor) {
	var end = item.next ? /** @type {TemplateNode} */ (item.next.e.nodes_start) : anchor;

	var dest = next ? /** @type {TemplateNode} */ (next.e.nodes_start) : anchor;
	var node = /** @type {TemplateNode} */ (item.e.nodes_start);

	while (node !== end) {
		var next_node = /** @type {TemplateNode} */ (get_next_sibling(node));
		dest.before(node);
		node = next_node;
	}
}

/**
 * @param {EachState} state
 * @param {EachItem | null} prev
 * @param {EachItem | null} next
 */
function link(state, prev, next) {
	if (prev === null) {
		state.first = next;
	} else {
		prev.next = next;
		prev.e.next = next && next.e;
	}

	if (next !== null) {
		next.prev = prev;
		next.e.prev = prev && prev.e;
	}
}

/** @import { Snippet } from 'svelte' */
/** @import { Effect, TemplateNode } from '#client' */
/** @import { Getters } from '#shared' */

/**
 * In development, wrap the snippet function so that it passes validation, and so that the
 * correct component context is set for ownership checks
 * @param {any} component
 * @param {(node: TemplateNode, ...args: any[]) => void} fn
 */
function wrap_snippet(component, fn) {
	return (/** @type {TemplateNode} */ node, /** @type {any[]} */ ...args) => {
		var previous_component_function = dev_current_component_function;
		set_dev_current_component_function(component);

		try {
			return fn(node, ...args);
		} finally {
			set_dev_current_component_function(previous_component_function);
		}
	};
}

/**
 * Sets the `selected` attribute on an `option` element.
 * Not set through the property because that doesn't reflect to the DOM,
 * which means it wouldn't be taken into account when a form is reset.
 * @param {HTMLOptionElement} element
 * @param {boolean} selected
 */
function set_selected(element, selected) {
	if (selected) {
		// The selected option could've changed via user selection, and
		// setting the value without this check would set it back.
		if (!element.hasAttribute('selected')) {
			element.setAttribute('selected', '');
		}
	} else {
		element.removeAttribute('selected');
	}
}

/**
 * @param {Element} element
 * @param {string} attribute
 * @param {string | null} value
 * @param {boolean} [skip_warning]
 */
function set_attribute(element, attribute, value, skip_warning) {
	// @ts-expect-error
	var attributes = (element.__attributes ??= {});

	if (attributes[attribute] === (attributes[attribute] = value)) return;

	if (attribute === 'style' && '__styles' in element) {
		// reset styles to force style: directive to update
		element.__styles = {};
	}

	if (attribute === 'loading') {
		// @ts-expect-error
		element[LOADING_ATTR_SYMBOL] = value;
	}

	if (value == null) {
		element.removeAttribute(attribute);
	} else if (typeof value !== 'string' && get_setters(element).includes(attribute)) {
		// @ts-ignore
		element[attribute] = value;
	} else {
		element.setAttribute(attribute, value);
	}
}

/**
 * Spreads attributes onto a DOM element, taking into account the currently set attributes
 * @param {Element & ElementCSSInlineStyle} element
 * @param {Record<string, any> | undefined} prev
 * @param {Record<string, any>} next New attributes - this function mutates this object
 * @param {string} [css_hash]
 * @param {boolean} [preserve_attribute_case]
 * @param {boolean} [is_custom_element]
 * @param {boolean} [skip_warning]
 * @returns {Record<string, any>}
 */
function set_attributes(
	element,
	prev,
	next,
	css_hash,
	preserve_attribute_case = false,
	is_custom_element = false,
	skip_warning = false
) {
	var current = prev || {};
	var is_option_element = element.tagName === 'OPTION';

	for (var key in prev) {
		if (!(key in next)) {
			next[key] = null;
		}
	}

	var setters = get_setters(element);

	// @ts-expect-error
	var attributes = /** @type {Record<string, unknown>} **/ (element.__attributes ??= {});

	// since key is captured we use const
	for (const key in next) {
		// let instead of var because referenced in a closure
		let value = next[key];

		// Up here because we want to do this for the initial value, too, even if it's undefined,
		// and this wouldn't be reached in case of undefined because of the equality check below
		if (is_option_element && key === 'value' && value == null) {
			// The <option> element is a special case because removing the value attribute means
			// the value is set to the text content of the option element, and setting the value
			// to null or undefined means the value is set to the string "null" or "undefined".
			// To align with how we handle this case in non-spread-scenarios, this logic is needed.
			// There's a super-edge-case bug here that is left in in favor of smaller code size:
			// Because of the "set missing props to null" logic above, we can't differentiate
			// between a missing value and an explicitly set value of null or undefined. That means
			// that once set, the value attribute of an <option> element can't be removed. This is
			// a very rare edge case, and removing the attribute altogether isn't possible either
			// for the <option value={undefined}> case, so we're not losing any functionality here.
			// @ts-ignore
			element.value = element.__value = '';
			current[key] = value;
			continue;
		}

		var prev_value = current[key];
		if (value === prev_value) continue;

		current[key] = value;

		var prefix = key[0] + key[1]; // this is faster than key.slice(0, 2)
		if (prefix === '$$') continue;

		if (prefix === 'on') {
			/** @type {{ capture?: true }} */
			const opts = {};
			const event_handle_key = '$$' + key;
			let event_name = key.slice(2);
			var delegated = is_delegated(event_name);

			if (is_capture_event(event_name)) {
				event_name = event_name.slice(0, -7);
				opts.capture = true;
			}

			if (!delegated && prev_value) {
				// Listening to same event but different handler -> our handle function below takes care of this
				// If we were to remove and add listeners in this case, it could happen that the event is "swallowed"
				// (the browser seems to not know yet that a new one exists now) and doesn't reach the handler
				// https://github.com/sveltejs/svelte/issues/11903
				if (value != null) continue;

				element.removeEventListener(event_name, current[event_handle_key], opts);
				current[event_handle_key] = null;
			}

			if (value != null) {
				if (!delegated) {
					/**
					 * @this {any}
					 * @param {Event} evt
					 */
					function handle(evt) {
						current[key].call(this, evt);
					}

					current[event_handle_key] = create_event(event_name, element, handle, opts);
				} else {
					// @ts-ignore
					element[`__${event_name}`] = value;
					delegate([event_name]);
				}
			} else if (delegated) {
				// @ts-ignore
				element[`__${event_name}`] = undefined;
			}
		} else if (key === 'style' && value != null) {
			element.style.cssText = value + '';
		} else if (key === 'autofocus') {
			autofocus(/** @type {HTMLElement} */ (element), Boolean(value));
		} else if (key === '__value' || (key === 'value' && value != null)) {
			// @ts-ignore
			element.value = element[key] = element.__value = value;
		} else if (key === 'selected' && is_option_element) {
			set_selected(/** @type {HTMLOptionElement} */ (element), value);
		} else {
			var name = key;
			if (!preserve_attribute_case) {
				name = normalize_attribute(name);
			}

			var is_default = name === 'defaultValue' || name === 'defaultChecked';

			if (value == null && !is_custom_element && !is_default) {
				attributes[key] = null;

				if (name === 'value' || name === 'checked') {
					// removing value/checked also removes defaultValue/defaultChecked — preserve
					let input = /** @type {HTMLInputElement} */ (element);

					if (name === 'value') {
						let prev = input.defaultValue;
						input.removeAttribute(name);
						input.defaultValue = prev;
					} else {
						let prev = input.defaultChecked;
						input.removeAttribute(name);
						input.defaultChecked = prev;
					}
				} else {
					element.removeAttribute(key);
				}
			} else if (
				is_default ||
				(setters.includes(name) && (is_custom_element || typeof value !== 'string'))
			) {
				// @ts-ignore
				element[name] = value;
			} else if (typeof value !== 'function') {
				{
					set_attribute(element, name, value);
				}
			}
		}
		if (key === 'style' && '__styles' in element) {
			// reset styles to force style: directive to update
			element.__styles = {};
		}
	}

	return current;
}

/** @type {Map<string, string[]>} */
var setters_cache = new Map();

/** @param {Element} element */
function get_setters(element) {
	var setters = setters_cache.get(element.nodeName);
	if (setters) return setters;
	setters_cache.set(element.nodeName, (setters = []));

	var descriptors;
	var proto = element; // In the case of custom elements there might be setters on the instance
	var element_proto = Element.prototype;

	// Stop at Element, from there on there's only unnecessary setters we're not interested in
	// Do not use contructor.name here as that's unreliable in some browser environments
	while (element_proto !== proto) {
		descriptors = get_descriptors(proto);

		for (var key in descriptors) {
			if (descriptors[key].set) {
				setters.push(key);
			}
		}

		proto = get_prototype_of(proto);
	}

	return setters;
}

/**
 * @param {Element} dom
 * @param {string} class_name
 * @param {boolean} value
 * @returns {void}
 */
function toggle_class(dom, class_name, value) {
	if (value) {
		if (dom.classList.contains(class_name)) return;
		dom.classList.add(class_name);
	} else {
		if (!dom.classList.contains(class_name)) return;
		dom.classList.remove(class_name);
	}
}

/**
 * @param {HTMLElement} dom
 * @param {string} key
 * @param {string} value
 * @param {boolean} [important]
 */
function set_style(dom, key, value, important) {
	// @ts-expect-error
	var styles = (dom.__styles ??= {});

	if (styles[key] === value) {
		return;
	}

	styles[key] = value;

	if (value == null) {
		dom.style.removeProperty(key);
	} else {
		dom.style.setProperty(key, value, '');
	}
}

/**
 * @param {any} bound_value
 * @param {Element} element_or_component
 * @returns {boolean}
 */
function is_bound_this(bound_value, element_or_component) {
	return (
		bound_value === element_or_component || bound_value?.[STATE_SYMBOL] === element_or_component
	);
}

/**
 * @param {any} element_or_component
 * @param {(value: unknown, ...parts: unknown[]) => void} update
 * @param {(...parts: unknown[]) => unknown} get_value
 * @param {() => unknown[]} [get_parts] Set if the this binding is used inside an each block,
 * 										returns all the parts of the each block context that are used in the expression
 * @returns {void}
 */
function bind_this(element_or_component = {}, update, get_value, get_parts) {
	effect(() => {
		/** @type {unknown[]} */
		var old_parts;

		/** @type {unknown[]} */
		var parts;

		render_effect(() => {
			old_parts = parts;
			// We only track changes to the parts, not the value itself to avoid unnecessary reruns.
			parts = [];

			untrack(() => {
				if (element_or_component !== get_value(...parts)) {
					update(element_or_component, ...parts);
					// If this is an effect rerun (cause: each block context changes), then nullfiy the binding at
					// the previous position if it isn't already taken over by a different effect.
					if (old_parts && is_bound_this(get_value(...old_parts), element_or_component)) {
						update(null, ...old_parts);
					}
				}
			});
		});

		return () => {
			// We cannot use effects in the teardown phase, we we use a microtask instead.
			queue_micro_task(() => {
				if (parts && is_bound_this(get_value(...parts), element_or_component)) {
					update(null, ...parts);
				}
			});
		};
	});

	return element_or_component;
}

/** @import { Source } from './types.js' */

/**
 * The proxy handler for rest props (i.e. `const { x, ...rest } = $props()`).
 * Is passed the full `$$props` object and excludes the named props.
 * @type {ProxyHandler<{ props: Record<string | symbol, unknown>, exclude: Array<string | symbol>, name?: string }>}}
 */
const rest_props_handler = {
	get(target, key) {
		if (target.exclude.includes(key)) return;
		return target.props[key];
	},
	set(target, key) {
		if (DEV) {
			// TODO should this happen in prod too?
			props_rest_readonly(`${target.name}.${String(key)}`);
		}

		return false;
	},
	getOwnPropertyDescriptor(target, key) {
		if (target.exclude.includes(key)) return;
		if (key in target.props) {
			return {
				enumerable: true,
				configurable: true,
				value: target.props[key]
			};
		}
	},
	has(target, key) {
		if (target.exclude.includes(key)) return false;
		return key in target.props;
	},
	ownKeys(target) {
		return Reflect.ownKeys(target.props).filter((key) => !target.exclude.includes(key));
	}
};

/**
 * @param {Record<string, unknown>} props
 * @param {string[]} exclude
 * @param {string} [name]
 * @returns {Record<string, unknown>}
 */
/*#__NO_SIDE_EFFECTS__*/
function rest_props(props, exclude, name) {
	return new Proxy(
		DEV ? { props, exclude, name, other: {}, to_proxy: [] } : { props, exclude },
		rest_props_handler
	);
}

/**
 * @template T
 * @param {() => T} fn
 * @returns {T}
 */
function with_parent_branch(fn) {
	var effect = active_effect;
	var previous_effect = active_effect;

	while (effect !== null && (effect.f & (BRANCH_EFFECT | ROOT_EFFECT)) === 0) {
		effect = effect.parent;
	}
	try {
		set_active_effect(effect);
		return fn();
	} finally {
		set_active_effect(previous_effect);
	}
}

/**
 * This function is responsible for synchronizing a possibly bound prop with the inner component state.
 * It is used whenever the compiler sees that the component writes to the prop, or when it has a default prop_value.
 * @template V
 * @param {Record<string, unknown>} props
 * @param {string} key
 * @param {number} flags
 * @param {V | (() => V)} [fallback]
 * @returns {(() => V | ((arg: V) => V) | ((arg: V, mutation: boolean) => V))}
 */
function prop(props, key, flags, fallback) {
	var immutable = (flags & PROPS_IS_IMMUTABLE) !== 0;
	var runes = !legacy_mode_flag || (flags & PROPS_IS_RUNES) !== 0;
	var bindable = (flags & PROPS_IS_BINDABLE) !== 0;
	var prop_value;

	{
		prop_value = /** @type {V} */ (props[key]);
	}

	// Can be the case when someone does `mount(Component, props)` with `let props = $state({...})`
	// or `createClassComponent(Component, props)`
	var is_entry_props = STATE_SYMBOL in props || LEGACY_PROPS in props;

	var setter =
		get_descriptor(props, key)?.set ??
		(is_entry_props && bindable && key in props ? (v) => (props[key] = v) : undefined);

	var fallback_value = /** @type {V} */ (fallback);
	var fallback_dirty = true;

	var get_fallback = () => {
		if (fallback_dirty) {
			fallback_dirty = false;
			{
				fallback_value = untrack(/** @type {() => V} */ (fallback));
			}
		}

		return fallback_value;
	};

	if (prop_value === undefined && fallback !== undefined) {
		if (setter && runes) {
			props_invalid_value(key);
		}

		prop_value = get_fallback();
		if (setter) setter(prop_value);
	}

	/** @type {() => V} */
	var getter;
	if (runes) {
		getter = () => {
			var value = /** @type {V} */ (props[key]);
			if (value === undefined) return get_fallback();
			fallback_dirty = true;
			return value;
		};
	} else {
		// Svelte 4 did not trigger updates when a primitive value was updated to the same value.
		// Replicate that behavior through using a derived
		var derived_getter = with_parent_branch(() =>
			(immutable ? derived : derived_safe_equal)(() => /** @type {V} */ (props[key]))
		);
		derived_getter.f |= LEGACY_DERIVED_PROP;
		getter = () => {
			var value = get(derived_getter);
			if (value !== undefined) fallback_value = /** @type {V} */ (undefined);
			return value === undefined ? fallback_value : value;
		};
	}

	// easy mode — prop is never written to
	{
		return getter;
	}
}

/**
 * @param {Record<string, any>} $$props
 * @param {string[]} bindable
 * @param {string[]} exports
 * @param {Function & { [FILENAME]: string }} component
 */
function validate_prop_bindings($$props, bindable, exports, component) {
	for (const key in $$props) {
		var setter = get_descriptor($$props, key)?.set;
		var name = component.name;

		if (setter) {
			if (exports.includes(key)) {
				bind_invalid_export(component[FILENAME], key, name);
			}

			if (!bindable.includes(key)) {
				bind_not_bindable(key, component[FILENAME], name);
			}
		}
	}
}

// generated during release, do not modify

const PUBLIC_VERSION = '5';

if (typeof window !== 'undefined')
	// @ts-ignore
	(window.__svelte ||= { v: new Set() }).v.add(PUBLIC_VERSION);

enable_legacy_mode_flag();

mark_module_start();
Loader[FILENAME] = "assets/svelte/Loader.svelte";

var root$3 = add_locations(template(`<div class="pprek24-loader svelte-fjbi06"></div>`), Loader[FILENAME], [[1, 0]]);

function Loader($$anchor, $$props) {
	check_target(new.target);
	push($$props, false, Loader);

	var div = root$3();

	append($$anchor, div);
	return pop({ ...legacy_api() });
}

mark_module_end(Loader);

mark_module_start();
CalendarNextEvents[FILENAME] = "assets/svelte/CalendarNextEvents.svelte";

var root_5$1 = add_locations(template(`ganztägig bis <time> </time>`, 1), CalendarNextEvents[FILENAME], [[59, 28]]);
var root_6$1 = add_locations(template(`<time> </time> bis <time><!> </time>`, 1), CalendarNextEvents[FILENAME], [[61, 14], [62, 14]]);

var root_2$1 = add_locations(template(`<li class="event svelte-guwymb"><div class="event-title svelte-guwymb"><a class="svelte-guwymb"> </a></div> <time class="event-date svelte-guwymb"><span class="svelte-guwymb"> </span> <span class="svelte-guwymb"> </span></time> <span class="event-time svelte-guwymb"><!></span></li>`), CalendarNextEvents[FILENAME], [
	[
		35,
		8,
		[
			[42, 10, [[43, 12]]],
			[45, 10, [[50, 12], [51, 12]]],
			[53, 10]
		]
	]
]);

var root_1$1 = add_locations(template(`<ul class="event-list svelte-guwymb"></ul>`), CalendarNextEvents[FILENAME], [[30, 4]]);
var root_8$1 = add_locations(template(`<div>Error</div> <pre> </pre>`, 1), CalendarNextEvents[FILENAME], [[74, 4], [75, 4]]);
var root$2 = add_locations(template(`<div aria-live="off" aria-atomic="true"><!></div>`), CalendarNextEvents[FILENAME], [[26, 0]]);

function CalendarNextEvents($$anchor, $$props) {
	check_target(new.target);
	push($$props, true, CalendarNextEvents);
	validate_prop_bindings($$props, [], [], CalendarNextEvents);

	const id = prop($$props, "id", 19, () => getRandomId(6, 'calendar-next-events_'));
	let busy = state(true);

	let events = proxy(fetch(` ${config.calendar_api_url}/next`, { cache: 'default' }).then(async (res) => {
		if (strict_equals(res.status, 200, false) && strict_equals(res.status, 304, false) && strict_equals(res.headers.get('X-API-Version'), '2', false)) {
			throw new Error(await res.json());
		}

		return await res.json();
	}).then((res) => res.events).finally(() => set(busy, false)));

	var div = root$2();
	var node = child(div);

	await_block(
		node,
		() => events,
		($$anchor) => {
			Loader($$anchor, {});
		},
		($$anchor, events) => {
			var ul = root_1$1();

			each(ul, 21, () => get(events), index, ($$anchor, event, index) => {
				var li = root_2$1();

				const query = derived(() => new URLSearchParams({
					start: get(event).start,
					id: get(event).id,
					title: get(event).title
				}));

				get(query);

				const startDate = derived(() => new Date(get(event).start));

				get(startDate);

				const endDate = derived(() => new Date(get(event).end));

				get(endDate);
				set_attribute(li, "aria-posinset", index + 1);

				var div_1 = child(li);
				var a = child(div_1);

				template_effect(() => set_attribute(a, "href", `/calendar?${get(query).toString() ?? ""}`));

				var text$1 = child(a, true);

				reset(a);
				reset(div_1);

				var time = sibling(div_1, 2);

				template_effect(() => set_attribute(time, "datetime", get(event).start.split('T')[0]));

				var span = child(time);
				var text_1 = child(span, true);

				template_effect(() => set_text(text_1, dateFormatters.twoDigitDayFormatter.format(get(startDate))));
				reset(span);

				var span_1 = sibling(span, 2);
				var text_2 = child(span_1, true);

				template_effect(() => set_text(text_2, dateFormatters.shortMonthFormatter.format(get(startDate))));
				reset(span_1);
				reset(time);

				var span_2 = sibling(time, 2);
				var node_1 = child(span_2);

				{
					var consequent = ($$anchor) => {
						var text_3 = text("ganztägig");

						append($$anchor, text_3);
					};

					var alternate_1 = ($$anchor) => {
						var fragment = comment();
						var node_2 = first_child(fragment);

						{
							var consequent_1 = ($$anchor) => {
								var fragment_1 = root_5$1();
								var time_1 = sibling(first_child(fragment_1));
								var text_4 = child(time_1, true);

								template_effect(() => set_text(text_4, dateFormatters.longDateFormatter.format(get(endDate))));
								reset(time_1);
								template_effect(() => set_attribute(time_1, "datetime", get(event).end));
								append($$anchor, fragment_1);
							};

							var alternate = ($$anchor) => {
								var fragment_2 = root_6$1();
								var time_2 = first_child(fragment_2);
								var text_5 = child(time_2);

								template_effect(() => set_text(text_5, `${dateFormatters.shortTimeFormatter.format(get(startDate)) ?? ""} Uhr`));
								reset(time_2);

								var time_3 = sibling(time_2, 2);
								var node_3 = child(time_3);

								{
									var consequent_2 = ($$anchor) => {
										var text_6 = text();

										template_effect(() => set_text(text_6, `${dateFormatters.longDateFormatter.format(get(endDate)) ?? ""} `));
										append($$anchor, text_6);
									};

									if_block(node_3, ($$render) => {
										if (strict_equals(get(event).start.split('T')[0], get(event).end.split('T')[0], false)) $$render(consequent_2);
									});
								}

								var text_7 = sibling(node_3);

								template_effect(() => set_text(text_7, ` ${dateFormatters.shortTimeFormatter.format(get(endDate)) ?? ""} Uhr`));
								reset(time_3);

								template_effect(() => {
									set_attribute(time_2, "datetime", get(event).start);
									set_attribute(time_3, "datetime", get(event).end);
								});

								append($$anchor, fragment_2);
							};

							if_block(
								node_2,
								($$render) => {
									if (get(event).allDay) $$render(consequent_1); else $$render(alternate, false);
								},
								true
							);
						}

						append($$anchor, fragment);
					};

					if_block(node_1, ($$render) => {
						if (get(event).allDay && strict_equals(get(event).start.split('T')[0], get(event).end.split('T')[0])) $$render(consequent); else $$render(alternate_1, false);
					});
				}

				reset(span_2);
				reset(li);

				template_effect(() => {
					set_attribute(li, "aria-labelledby", `${id() ?? ""}_$${index ?? ""}_title`);
					set_attribute(li, "aria-describedby", `${id() ?? ""}_${index ?? ""}_date ${id() ?? ""}_${index ?? ""}_time`);
					set_attribute(li, "aria-setsize", get(events).length);
					set_attribute(div_1, "id", `${id() ?? ""}_${index ?? ""}_title`);
					set_text(text$1, get(event).title);
					set_attribute(time, "id", `${id() ?? ""}_${index ?? ""}_date`);
					set_attribute(span_2, "id", `${id() ?? ""}_${index ?? ""}_time`);
				});

				append($$anchor, li);
			});

			reset(ul);
			template_effect(() => set_attribute(ul, "id", id()));
			append($$anchor, ul);
		},
		($$anchor, error) => {
			var fragment_4 = root_8$1();
			var pre = sibling(first_child(fragment_4), 2);
			var text_8 = child(pre, true);

			reset(pre);
			template_effect(() => set_text(text_8, get(error)));
			append($$anchor, fragment_4);
		}
	);
	template_effect(() => set_attribute(div, "aria-busy", get(busy)));
	append($$anchor, div);
	return pop({ ...legacy_api() });
}

mark_module_end(CalendarNextEvents);

mark_module_start();
Icon[FILENAME] = "assets/svelte/Icon.svelte";

var root$1 = add_locations(template(`<i></i>`), Icon[FILENAME], [[17, 0]]);

function Icon($$anchor, $$props) {
	check_target(new.target);
	push($$props, true, Icon);
	validate_prop_bindings($$props, [], [], Icon);

	const rest = rest_props(
		$$props,
		[
			"$$slots",
			"$$events",
			"$$legacy",
			"icon",
			"class"
		],
		"rest"
	);

	const classes = ['bi'];

	classes.push(`bi-${$$props.icon.replace(/([A-Z])/g, '-$1').toLowerCase()}`);

	if (equals($$props.class, null, false)) {
		classes.push($$props.class);
	}

	const className = proxy(classes.join(' '));
	var i = root$1();
	let attributes;

	template_effect(() => attributes = set_attributes(i, attributes, { class: className, role: "img", ...rest }));
	append($$anchor, i);
	return pop({ ...legacy_api() });
}

mark_module_end(Icon);

mark_module_start();
CalendarMonth[FILENAME] = "assets/svelte/CalendarMonth.svelte";

var root_2 = add_locations(template(`<th class="svelte-pb28ll"><span class="pprek-calendar-weekday--long"> </span> <span class="pprek-calendar-weekday--short" aria-hidden="true"> </span></th>`), CalendarMonth[FILENAME], [
	[
		153,
		12,
		[[154, 14], [155, 14]]
	]
]);

var root_7 = add_locations(template(`<time class="svelte-pb28ll"> </time>`), CalendarMonth[FILENAME], [[187, 26]]);
var root_6 = add_locations(template(`<li class="svelte-pb28ll"><a class="svelte-pb28ll"><!> </a></li>`), CalendarMonth[FILENAME], [[184, 22, [[185, 24]]]]);
var root_5 = add_locations(template(`<ul class="svelte-pb28ll"></ul>`), CalendarMonth[FILENAME], [[181, 18]]);
var root_4 = add_locations(template(`<td role="gridcell" class="svelte-pb28ll"> <!></td>`), CalendarMonth[FILENAME], [[171, 14]]);
var root_3 = add_locations(template(`<tr class="svelte-pb28ll"></tr>`), CalendarMonth[FILENAME], [[169, 10]]);

var root_1 = add_locations(template(`<header class="pprek-calendar-month-title svelte-pb28ll"><button class="pprek-calendar-month-prev svelte-pb28ll"><!></button> <h2 class="svelte-pb28ll"> </h2> <button class="pprek-calendar-month-next svelte-pb28ll"><!></button></header> <table class="pprek-calendar-month svelte-pb28ll" role="grid"><thead aria-hidden="true" class="svelte-pb28ll"><tr class="svelte-pb28ll"><!><!><!><!><!><!><!></tr></thead><tbody class="svelte-pb28ll"></tbody></table>`, 1), CalendarMonth[FILENAME], [
	[
		143,
		4,
		[[144, 6], [145, 6], [146, 6]]
	],
	[
		148,
		4,
		[
			[149, 6, [[150, 8]]],
			[167, 6]
		]
	]
]);

var root_8 = add_locations(template(`<div>Error</div> <pre> </pre>`, 1), CalendarMonth[FILENAME], [[202, 4], [203, 4]]);
var root = add_locations(template(`<div aria-live="off" aria-atomic="true"><!></div>`), CalendarMonth[FILENAME], [[139, 0]]);

function CalendarMonth($$anchor, $$props) {
	check_target(new.target);
	push($$props, true, CalendarMonth);
	validate_prop_bindings($$props, [], [], CalendarMonth);

	const now = new Date();
	const id = prop($$props, "id", 19, () => getRandomId(6, 'calendar-next-events_'));
	let year = state(proxy($$props.year ?? now.getFullYear()));
	let month = state(proxy($$props.month ?? now.getMonth() + 1));
	let wrapper;
	let longTitles = state(true);

	const prev = () => {
		update(month, -1);

		if (strict_equals(get(month), 0)) {
			set(month, 12);
			update(year, -1);
		}

		const url = window.location.href.split('?')[0];

		const query = new URLSearchParams({
			year: get(year).toString(),
			month: get(month).toString()
		});

		window.history.pushState(
			{
				year: get(year),
				month: get(month)
			},
			'',
			`${url}?${query}`
		);
	};

	const next = () => {
		update(month);

		if (strict_equals(get(month), 13)) {
			set(month, 1);
			update(year);
		}

		const url = window.location.href.split('?')[0];

		const query = new URLSearchParams({
			year: get(year).toString(),
			month: get(month).toString()
		});

		window.history.pushState(
			{
				year: get(year),
				month: get(month)
			},
			'',
			`${url}?${query}`
		);
	};

	let firstOfMonth = derived(() => new Date(get(year), get(month) - 1, 1, 0, 0, 0, 0));

	let firstVisible = derived(() => {
		const d = new Date(get(firstOfMonth));

		d.setDate(-1 * ((d.getDay() + 6) % 7) + 1);
		return d;
	});

	let busy = state(true);

	let req = derived(() => fetch(` ${config.calendar_api_url}/${get(year)}/${get(month)}`, { cache: 'default' }).then(async (res) => {
		if (strict_equals(res.status, 200, false) && strict_equals(res.status, 304, false) && strict_equals(res.headers.get('X-API-Version'), '2', false)) {
			throw new Error(await res.json());
		}

		return await res.json();
	}).then((res) => {
		const days = new Array(6).fill(null).map(() => new Array(7).fill(null));
		const date = new Date(get(firstVisible));

		for (let w = 0; w < 6; w++) {
			for (let d = 0; d < 7; d++) {
				const events = res.events.filter((event) => eventAffectsDate(event, date));

				days[w][d] = {
					dateString: `${date.getFullYear()}-${leftPad(date.getMonth() + 1)}-${leftPad(date.getDate())}`,
					day: date.getDate(),
					label: dateFormatters.longDateFormatter.format(date),
					events,
					eventFul: events.length > 0,
					type: events.length > 0 ? 'eventful' : 'eventless',
					position: strict_equals(date.getMonth() + 1, get(month)) ? 'in-month' : 'out-of-month'
				};

				date.setHours(24);
			}
		}

		return Object.assign(res, { days });
	}).finally(() => set(busy, false)));

	user_effect(() => {
		if (strict_equals(wrapper, undefined)) {
			return;
		}

		const headerCells = Array.from(wrapper.querySelectorAll('thead tr th'));
		const padding = getComputedStyle(headerCells[0]).paddingInline.split(' ').reduce((acc, cur) => acc + parseInt(cur), 0);
		const maxWidth = headerCells[0].getBoundingClientRect().width - padding;

		for (const cell of headerCells) {
			const longText = cell.querySelector('.pprek-calendar-weekday--long');

			if (maxWidth < longText.getBoundingClientRect().width) {
				set(longTitles, false);
				return;
			}
		}

		set(longTitles, true);
	});

	var div = root();
	var node = child(div);

	await_block(
		node,
		() => get(req),
		($$anchor) => {
			Loader($$anchor, {});
		},
		($$anchor, $$source) => {
			var $$value = derived(() => {
				var { days } = get($$source);

				return { days };
			});

			var days = derived(() => get($$value).days);
			var fragment = root_1();
			var header = first_child(fragment);
			var button = child(header);

			button.__click = prev;

			var node_1 = child(button);

			Icon(node_1, { icon: "caretLeftFill", "aria-hidden": "true" });
			reset(button);

			var h2 = sibling(button, 2);
			var text = child(h2);

			template_effect(() => set_text(text, `Unsere Termine im ${dateFormatters.longMonthFormatter.format(get(firstOfMonth)) ?? ""}`));
			reset(h2);

			var button_1 = sibling(h2, 2);

			button_1.__click = next;

			var node_2 = child(button_1);

			Icon(node_2, { icon: "caretRightFill", "aria-hidden": "true" });
			reset(button_1);
			reset(header);

			var table = sibling(header, 2);
			var thead = child(table);
			var tr = child(thead);

			{
				const th = wrap_snippet(CalendarMonth, ($$anchor, day = noop) => {
					var th_1 = root_2();
					const date = derived(() => new Date(2024, 11, 1 + day(), 0, 0, 0, 0));

					get(date);

					var span = child(th_1);
					var text_1 = child(span, true);

					template_effect(() => set_text(text_1, dateFormatters.longWeekDayFormatter.format(get(date))));
					reset(span);

					var span_1 = sibling(span, 2);
					var text_2 = child(span_1, true);

					template_effect(() => set_text(text_2, dateFormatters.shortWeekDayFormatter.format(get(date))));
					reset(span_1);
					reset(th_1);

					template_effect(() => {
						toggle_class(span, "sr-only", !get(longTitles));
						set_style(span_1, "display", get(longTitles) ? 'none' : undefined);
					});

					append($$anchor, th_1);
				});

				var node_3 = child(tr);

				th(node_3, () => 1);

				var node_4 = sibling(node_3);

				th(node_4, () => 2);

				var node_5 = sibling(node_4);

				th(node_5, () => 3);

				var node_6 = sibling(node_5);

				th(node_6, () => 4);

				var node_7 = sibling(node_6);

				th(node_7, () => 5);

				var node_8 = sibling(node_7);

				th(node_8, () => 6);

				var node_9 = sibling(node_8);

				th(node_9, () => 7);
				reset(tr);
			}

			reset(thead);

			var tbody = sibling(thead);

			each(tbody, 21, () => get(days), index, ($$anchor, week) => {
				var tr_1 = root_3();

				each(tr_1, 21, () => get(week), index, ($$anchor, day) => {
					var td = root_4();
					var text_3 = child(td);
					var node_10 = sibling(text_3);

					{
						var consequent_1 = ($$anchor) => {
							var ul = root_5();

							each(ul, 21, () => get(day).events, index, ($$anchor, event) => {
								var li = root_6();

								const query = derived(() => new URLSearchParams({
									id: get(event).id,
									start: get(event).start,
									title: get(event).title
								}));

								get(query);

								var a = child(li);

								template_effect(() => set_attribute(a, "href", `${config.calendar_page ?? ""}?${get(query).toString() ?? ""}`));

								var node_11 = child(a);

								{
									var consequent = ($$anchor) => {
										var time = root_7();
										var text_4 = child(time, true);

										template_effect(() => set_text(text_4, dateFormatters.shortTimeFormatter.format(new Date(get(event).start))));
										reset(time);
										template_effect(() => set_attribute(time, "datetime", get(event).start));
										append($$anchor, time);
									};

									if_block(node_11, ($$render) => {
										if (!get(event).allDay && get(event).start.includes(get(day).dateString)) $$render(consequent);
									});
								}

								var text_5 = sibling(node_11);

								reset(a);
								reset(li);
								template_effect(() => set_text(text_5, ` ${get(event).title ?? ""}`));
								append($$anchor, li);
							});

							reset(ul);
							append($$anchor, ul);
						};

						if_block(node_10, ($$render) => {
							if (get(day).eventFul) $$render(consequent_1);
						});
					}

					reset(td);

					template_effect(() => {
						set_attribute(td, "aria-disabled", strict_equals(get(day).position, 'out-of-month') ? true : undefined);
						set_attribute(td, "aria-label", get(day).label);
						set_attribute(td, "data-day", get(day).dateString);
						set_attribute(td, "data-position", get(day).position);
						set_attribute(td, "data-type", get(day).type);
						set_text(text_3, `${get(day).day ?? ""} `);
					});

					append($$anchor, td);
				});

				reset(tr_1);
				append($$anchor, tr_1);
			});

			reset(tbody);
			reset(table);
			bind_this(table, ($$value) => wrapper = $$value, () => wrapper);

			template_effect(() => {
				set_attribute(h2, "id", `${id() ?? ""}_title`);
				set_attribute(table, "id", id());
				set_attribute(table, "aria-labelledby", `${id() ?? ""}_title`);
			});

			append($$anchor, fragment);
		},
		($$anchor, error) => {
			var fragment_1 = root_8();
			var pre = sibling(first_child(fragment_1), 2);
			var text_6 = child(pre, true);

			reset(pre);
			template_effect(() => set_text(text_6, get(error)));
			append($$anchor, fragment_1);
		}
	);
	template_effect(() => set_attribute(div, "aria-busy", get(busy)));
	append($$anchor, div);
	return pop({ ...legacy_api() });
}

mark_module_end(CalendarMonth);
delegate(["click"]);

new SiteNav();
const defaultImgs = document.querySelectorAll('.card .card-img.default-img');
defaultImgs.forEach(element => {
    const factor = Math.round(Math.random() * 360);
    element.style.backgroundImage = [
        `radial-gradient(at 78% 29%, hsl(${(77 + factor) % 360} 71% 43%) 0px, transparent 50%)`,
        `radial-gradient(at 18% 25%, hsl(${(126 + factor) % 360} 68% 37%) 0px, transparent 50%)`,
        `radial-gradient(at 55% 54%, hsl(${(227 + factor) % 360} 31% 49%) 0px, transparent 50%)`,
        `radial-gradient(at 28% 74%, hsl(${(189 + factor) % 360} 58% 55%) 0px, transparent 50%)`
    ].join();
});
if (config.calendar_api_url != null && config.calendar_api_url.trim().length >= 0) {
    const calendarElements = document.querySelectorAll('[data-pprek-calendar]');
    calendarElements.forEach(element => {
        switch (element.dataset.pprekCalendar) {
            case 'next':
                mount(CalendarNextEvents, { target: element });
                break;
            case 'month':
                mount(CalendarMonth, {
                    target: element,
                    props: {
                        year: useIf(element.dataset.pprekYear, it => it != null && it.trim() !== '', parseInt, undefined),
                        month: useIf(element.dataset.pprekMonth, it => it != null && it.trim() !== '', parseInt, undefined)
                    }
                });
                break;
        }
    });
}
//# sourceMappingURL=app.js.map
