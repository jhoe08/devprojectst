// helpers.js
function fullName(firstname, middlename, lastname, extname) {
  return [firstname, middlename, lastname, extname]
    .filter(name => name && name.trim() !== '')
    .join(' ') || 'No name provided';
}

module.exports = { fullName };