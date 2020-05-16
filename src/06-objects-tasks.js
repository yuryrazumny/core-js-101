/* ************************************************************************************************
 *                                                                                                *
 * Plese read the following tutorial before implementing tasks:                                   *
 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Object_initializer *
 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object        *
 *                                                                                                *
 ************************************************************************************************ */


/**
 * Returns the rectagle object with width and height parameters and getArea() method
 *
 * @param {number} width
 * @param {number} height
 * @return {Object}
 *
 * @example
 *    const r = new Rectangle(10,20);
 *    console.log(r.width);       // => 10
 *    console.log(r.height);      // => 20
 *    console.log(r.getArea());   // => 200
 */
function Rectangle(width, height) {
  // throw new Error('Not implemented');
  const r = {};
  r.width = width;
  r.height = height;
  r.getArea = function getArea() {
    return this.width * this.height;
  };
  return r;
}


/**
 * Returns the JSON representation of specified object
 *
 * @param {object} obj
 * @return {string}
 *
 * @example
 *    [1,2,3]   =>  '[1,2,3]'
 *    { width: 10, height : 20 } => '{"height":10,"width":20}'
 */
function getJSON(obj) {
  // throw new Error('Not implemented');
  return JSON.stringify(obj);
}


/**
 * Returns the object of specified type from JSON representation
 *
 * @param {Object} proto
 * @param {string} json
 * @return {object}
 *
 * @example
 *    const r = fromJSON(Circle.prototype, '{"radius":10}');
 *
 */
function fromJSON(proto, json) {
  // throw new Error('Not implemented');
  const obj = { __proto__: proto };
  const parseJson = JSON.parse(json);
  Object.assign(obj, parseJson);
  return obj;
}


/**
 * Css selectors builder
 *
 * Each complex selector can consists of type, id, class, attribute, pseudo-class
 * and pseudo-element selectors:
 *
 *    element#id.class[attr]:pseudoClass::pseudoElement
 *              \----/\----/\----------/
 *              Can be several occurences
 *
 * All types of selectors can be combined using the combinators ' ','+','~','>' .
 *
 * The task is to design a single class, independent classes or classes hierarchy
 * and implement the functionality to build the css selectors using the provided cssSelectorBuilder.
 * Each selector should have the stringify() method to output the string repsentation
 * according to css specification.
 *
 * Provided cssSelectorBuilder should be used as facade only to create your own classes,
 * for example the first method of cssSelectorBuilder can be like this:
 *   element: function(value) {
 *       return new MySuperBaseElementSelector(...)...
 *   },
 *
 * The design of class(es) is totally up to you, but try to make it as simple,
 * clear and readable as possible.
 *
 * @example
 *
 *  const builder = cssSelectorBuilder;
 *
 *  builder.id('main').class('container').class('editable').stringify()
 *    => '#main.container.editable'
 *
 *  builder.element('a').attr('href$=".png"').pseudoClass('focus').stringify()
 *    => 'a[href$=".png"]:focus'
 *
 *  builder.combine(
 *      builder.element('div').id('main').class('container').class('draggable'),
 *      '+',
 *      builder.combine(
 *          builder.element('table').id('data'),
 *          '~',
 *           builder.combine(
 *               builder.element('tr').pseudoClass('nth-of-type(even)'),
 *               ' ',
 *               builder.element('td').pseudoClass('nth-of-type(even)')
 *           )
 *      )
 *  ).stringify()
 *    => 'div#main.container.draggable + table#data ~ tr:nth-of-type(even)   td:nth-of-type(even)'
 *
 *  For more examples see unit tests.
 */

class CSSSelectorBuilder {
  constructor() {
    this.string = '';
    this.existsElement = false;
    this.existsId = false;
    this.existsPseudoElement = false;
    this.weight = null;
  }

  checkIfDuplicate(selectorType) {
    let isDuplicate;
    if (selectorType === 'element') {
      isDuplicate = this.existsElement;
    }
    if (selectorType === 'id') {
      isDuplicate = this.existsId;
    }
    if (selectorType === 'pseudo-element') {
      isDuplicate = this.existsPseudoElement;
    }

    if (isDuplicate) {
      throw new Error('Element, id and pseudo-element should not occur more then one time inside the selector');
    }
  }

  checkSelectorWeight(weight) {
    if (weight < this.weight) {
      throw new Error('Selector parts should be arranged in the following order: element, id, class, attribute, pseudo-class, pseudo-element');
    }
    this.weight = weight;
  }

  setValue(value, selector) {
    this.string += `${selector}${value}`;
  }

  element(value, selector = '') {
    this.checkIfDuplicate('element');
    this.checkSelectorWeight(1);

    this.existsElement = true;
    this.setValue(value, selector);

    return this;
  }

  id(value, selector = '#') {
    this.checkIfDuplicate('id');
    this.checkSelectorWeight(10);

    this.existsId = true;
    this.setValue(value, selector);

    return this;
  }

  class(value, selector = '.') {
    this.checkSelectorWeight(100);

    this.setValue(value, selector);

    return this;
  }

  attr(value, selector = '') {
    this.checkSelectorWeight(1000);

    this.setValue(`[${value}]`, selector);

    return this;
  }

  pseudoClass(value, selector = ':') {
    this.checkSelectorWeight(10000);

    this.setValue(value, selector);

    return this;
  }

  pseudoElement(value, selector = '::') {
    this.checkIfDuplicate('pseudo-element');
    this.checkSelectorWeight(100000);

    this.existsPseudoElement = true;
    this.setValue(value, selector);

    return this;
  }

  combine(selector1, combinator, selector2) {
    this.setValue(`${selector1.stringify()} ${combinator} ${selector2.stringify()}`, '');

    return this;
  }

  stringify() {
    const { string } = this;

    this.string = '';

    return string;
  }
}

const cssSelectorBuilder = {
  createObject() {
    const newObject = new CSSSelectorBuilder();

    return newObject;
  },

  element(value) {
    return this.createObject().element(value);
  },

  id(value) {
    return this.createObject().id(value);
  },

  class(value) {
    return this.createObject().class(value);
  },

  attr(value) {
    return this.createObject().attr(value);
  },

  pseudoClass(value) {
    return this.createObject().pseudoClass(value);
  },

  pseudoElement(value) {
    return this.createObject().pseudoElement(value);
  },

  combine(selector1, combinator, selector2) {
    return this.createObject().combine(selector1, combinator, selector2);
  },
};


module.exports = {
  Rectangle,
  getJSON,
  fromJSON,
  cssSelectorBuilder,
};
