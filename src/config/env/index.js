const development = require ('./development.js')
const production = require ('./production.js')

let environment = development;
if (process.env.NODE_ENV === 'production'){
    environment = production;
}

module.exports = environment;