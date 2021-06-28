'use strict';

const nullChecker = (value) => {
  return (
    value === undefined ||
    value === 'undefined' ||
    value === '' ||
    value === null ||
    value === 'null' ||
    value === []
  );
};

module.exports = nullChecker;
