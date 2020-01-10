'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class Client extends Model {
    sales (){
        this.hasMany("App/Models/Sale")
    }
}

module.exports = Client
