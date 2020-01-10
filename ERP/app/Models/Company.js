'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class Company extends Model {
    users (){
        return this.belongsTo("App/Models/User")
    }

    products (){
        return this.hasMany("App/Models/Product")
    }

    sales (){
        return this.hasMany("App/Models/Sale")
    }

    clients (){
        return this.hasMany("App/Models/Client")
    }
}

module.exports = Company
