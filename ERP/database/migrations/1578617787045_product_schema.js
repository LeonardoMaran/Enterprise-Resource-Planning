'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class ProductSchema extends Schema {
  up () {
    this.create('products', (table) => {
      table.increments()
      table.string("name").notNullable().unique()
      table.decimal("price").notNullable()
      table
        .integer("created_by")
        .unsigned()
        .references("id")
        .inTable("users")
      table
        .integer("company_id")
        .unsigned()
        .references("id")
        .inTable("companies")
      table.timestamps()
    })
  }

  down () {
    this.drop('products')
  }
}

module.exports = ProductSchema
