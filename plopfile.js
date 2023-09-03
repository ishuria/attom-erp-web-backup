const curdGenerator = require('./plop-template/curd/prompt')

module.exports = (plop) => {
  plop.setGenerator('curd', curdGenerator)
}
