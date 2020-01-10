'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class ClientSchema extends Schema {
  up () {
    this.create('clients', (table) => {
      table.increments()
      table.string("name").notNullable()
      table
        .integer("company_id")
        .unsigned()
        .references("id")
        .inTable("companies")
      table
        .integer("created_by")
        .unsigned()
        .references("id")
        .inTable("users")
      table.timestamps()
    })
  }

  down () {
    this.drop('clients')
  }
}

module.exports = ClientSchema
