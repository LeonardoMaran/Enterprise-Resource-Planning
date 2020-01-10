'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class SaleSchema extends Schema {
  up () {
    this.create('sales', (table) => {
      table.increments()
      table.integer("quantity").notNullable()
      table.decimal("price")
      table
        .integer("company_id")
        .unsigned()
        .references("id")
        .inTable("companies")
      table
        .integer("product_id")
        .unsigned()
        .references("id")
        .inTable("users")
      table
        .integer("created_by")
        .unsigned()
        .references("id")
        .inTable("users")
      table.timestamps()
    })
  }

  down () {
    this.drop('sales')
  }
}

module.exports = SaleSchema
