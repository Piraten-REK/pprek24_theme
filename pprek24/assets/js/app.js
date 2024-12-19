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
const config = useIfExists(document.querySelector('#pprek_js_conf'), it => JSON.parse(it.textContent ?? '{}'), {});

var _a;
class CalendarBase {
    element;
    id;
    constructor(element) {
        this.element = element;
        this.id = CalendarBase.getRandomId(6, 'calendar-event-list_');
    }
    static twoDigitDayFormatter = new Intl.DateTimeFormat(undefined, { day: '2-digit' });
    static shortMonthFormatter = new Intl.DateTimeFormat(undefined, { month: 'short' });
    static shortTimeFormatter = new Intl.DateTimeFormat(undefined, { hour12: false, timeStyle: 'short' });
    static longDateFormatter = new Intl.DateTimeFormat(undefined, { dateStyle: 'long' });
    static longMonthFormatter = new Intl.DateTimeFormat(undefined, { month: 'long', year: 'numeric' });
    static shortWeekDayFormatter = new Intl.DateTimeFormat(undefined, { weekday: 'short' });
    static longWeekDayFormatter = new Intl.DateTimeFormat(undefined, { weekday: 'long' });
    static randomCharPool = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    static getRandomId(length = 6, prefix = '', postfix = '', attempt = 0) {
        if (attempt == 100) {
            throw new Error('Unable to create random id');
        }
        let str = prefix;
        for (let i = 0; i < Math.max(1, Math.floor(length)); i++) {
            const char = CalendarBase.randomCharPool[Math.round(Math.random() * CalendarBase.randomCharPool.length)];
            str += char;
        }
        str += postfix;
        return (document.getElementById(str) != null)
            ? CalendarBase.getRandomId(length, prefix, postfix, ++attempt)
            : str;
    }
}
class CalendarEventList extends CalendarBase {
    events = [];
    constructor(element) {
        super(element);
        this.#fetchData().then(events => {
            this.events = events;
            const feedElem = this.#eventsFeedFactory();
            const eventElems = this.events.map(this.#eventElementFactory.bind(this));
            feedElem.append(...eventElems);
            this.element.replaceWith(feedElem);
        }).catch(error => console.error(error));
    }
    async #fetchData() {
        return await fetch(`${config.calendar_api_url}/next`, { cache: 'default' })
            .then(async (res) => {
            if ((res.status !== 200 && res.status !== 304) && res.headers.get('X-Api-Version') !== '2') {
                throw new Error(await res.json());
            }
            return await res.json();
        })
            .then(res => res.events);
    }
    #eventsFeedFactory() {
        const feed = document.createElement('div');
        feed.classList.add('pprek_calendar-event-list');
        feed.id = this.id;
        return feed;
    }
    #eventElementFactory(event, idx, { length }) {
        const startDate = new Date(event.start);
        const endDate = new Date(event.end);
        const article = document.createElement('article');
        article.classList.add('pprek_calendar-event-list_item');
        article.setAttribute('aria-labelledby', `${this.id}_${idx}_title`);
        article.setAttribute('aria-describedby', `${this.id}_${idx}_date ${this.id}_${idx}_time`);
        article.setAttribute('aria-posinset', idx.toString());
        article.setAttribute('aria-setsize', length.toString());
        const title = document.createElement('div');
        title.classList.add('pprek_calendar-event-list_item_title');
        title.id = `${this.id}_${idx}_title`;
        const titleLink = document.createElement('a');
        const query = new URLSearchParams({
            start: event.start,
            id: event.id,
            title: event.title
        });
        titleLink.href = `/calendar?${query.toString()}`;
        titleLink.textContent = event.title;
        title.append(titleLink);
        const date = document.createElement('time');
        date.classList.add('pprek_calendar-event-list_item_date');
        date.id = `${this.id}_${idx}_date`;
        date.dateTime = event.start.split('T')[0];
        const dateDay = document.createElement('span');
        dateDay.textContent = CalendarBase.twoDigitDayFormatter.format(startDate);
        const dateMonth = document.createElement('span');
        dateMonth.textContent = CalendarBase.shortMonthFormatter.format(startDate);
        date.append(dateDay, dateMonth);
        const time = document.createElement('span');
        time.classList.add('pprek_calendar-event-list_item_time');
        time.id = `${this.id}_${idx}_time`;
        if (event.allDay && event.start.split('T')[0] === event.end.split('T')[0]) {
            time.textContent = 'ganztägig';
        }
        else if (event.allDay) {
            const timeText = document.createTextNode('ganztägig bis ');
            const timeEnd = document.createElement('time');
            timeEnd.dateTime = event.end;
            timeEnd.textContent = CalendarBase.longDateFormatter.format(endDate);
            time.append(timeText, timeEnd);
        }
        else {
            const timeStart = document.createElement('time');
            timeStart.dateTime = event.start;
            timeStart.textContent = `${CalendarBase.shortTimeFormatter.format(startDate)} Uhr`;
            const timeText = document.createTextNode(' bis ');
            const timeEnd = document.createElement('time');
            timeEnd.dateTime = event.end;
            timeEnd.textContent = `${event.start.split('T')[0] !== event.end.split('T')[0] ? CalendarBase.longDateFormatter.format(endDate) + ' ' : ''}${CalendarBase.shortTimeFormatter.format(endDate)} Uhr`;
            time.append(timeStart, timeText, timeEnd);
        }
        article.append(title, date, time);
        return article;
    }
}
class CalendarMonth extends CalendarBase {
    year;
    month;
    firstOfMonth;
    firstVisible;
    events = [];
    constructor(element) {
        super(element);
        this.year = parseInt(element.dataset.pprekYear ?? '');
        this.month = parseInt(element.dataset.pprekMonth ?? '');
        this.firstOfMonth = new Date(this.year, this.month - 1, 1, 0, 0, 0, 0);
        this.firstVisible = new Date(this.firstOfMonth);
        this.firstVisible.setDate(-1 * ((this.firstVisible.getDay() + 6) % 7) + 1);
        console.log(this.firstVisible);
        this.element.replaceWith(this.#tableFactory());
    }
    #tableFactory() {
        const table = document.createElement('table');
        const caption = document.createElement('caption');
        caption.textContent = `Unsere Termine im ${CalendarBase.longMonthFormatter.format(this.firstOfMonth)}`;
        const head = document.createElement('thead');
        const hTr = document.createElement('tr');
        const monDate = new Date(2024, 11, 2, 0, 0, 0, 0);
        for (let d = 3; d < 10; d++) {
            const th = document.createElement('th');
            th.title = CalendarBase.longWeekDayFormatter.format(monDate);
            th.textContent = CalendarBase.shortWeekDayFormatter.format(monDate);
            hTr.append(th);
            monDate.setDate(d);
        }
        head.append(hTr);
        const date = new Date(this.firstVisible);
        const body = document.createElement('tbody');
        for (let w = 0; w < 6; w++) {
            const bTr = document.createElement('tr');
            for (let d = 0; d < 7; d++) {
                const events = this.events.filter(event => _a.eventAffectsDate(event, date));
                const td = document.createElement('td');
                td.ariaLabel = CalendarBase.longDateFormatter.format(date);
                td.dataset.day = date.getDate().toString();
                td.dataset.place = date.getMonth() + 1 === this.month ? 'in' : 'out';
                td.dataset.type = events.length > 0 ? 'eventful' : 'eventless';
                bTr.append(td);
                date.setHours(24);
            }
            body.append(bTr);
        }
        table.append(caption, head, body);
        return table;
    }
    static eventAffectsDate(event, date) {
        const start = new Date(event.start);
        const end = new Date(event.end);
        const startInt = start.getFullYear() * 10000 + (start.getMonth() + 1) * 100 + start.getDate();
        const endInt = end.getFullYear() * 10000 + (end.getMonth() + 1) * 100 + end.getDate();
        const int = date.getFullYear() * 10000 + (date.getMonth() + 1) * 100 + date.getDate();
        return startInt <= int && endInt >= int;
    }
}
_a = CalendarMonth;

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
                new CalendarEventList(element);
                break;
            case 'month':
                new CalendarMonth(element);
                break;
        }
    });
}
//# sourceMappingURL=app.js.map
