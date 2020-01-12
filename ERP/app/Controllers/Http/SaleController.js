'use strict'

const Product = use("App/Models/Product")
const Company = use("App/Models/Company")
const Sale = use("App/Models/Sale")

/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */

class SaleController {

    async index ({ params, response }) {
        
        try {
            const company = await Company.findOrFail(params.id)

            return company
                .sales()
                .fetch()
        } catch (e) {
            return response.status(404)
        }
    }

    async store ({ request, response, params, auth }) {
        
        // Receiving the company
        const company = await Company.findOrFail(params.id)

        // Authentication
        if (auth.user.id == company.creator_id) {
            
            // Getting the product name
            var {product, client} = await request.all()

            // Verifying if this company has the product
            product = await company.products().where('name', product).fetch()
            client = await company.clients().where('name', client).fetch()

            if (product.size() != 0 && client.size() != 0) {
                
                // Getting the plus informations
                const sale = request.only([
                    "quantity", 
                    "price"
                ])

                const data = await Sale.create({
                    ...sale, 
                    company_id: params.id, 
                    created_by: auth.user.id,
                    client_id: client.toJSON()[0].id,
                    product_id: product.toJSON()[0].id
                })

                return data
                
            } else {
                return response.status(400).send({ error: "This company doesn't have the product or client"})
            }

        } else {
            return response.status(401).send({ error: "Not authorized" })
        }
    }

    async show ({ params, response }) {
        try {
            
            const sale = await Sale.findOrFail(params.id)
            
            return sale
        } catch (e) {
            return response.status(404).send(e)
        } 
    }

    async update ({ request, response, params, auth }) {
        const {id} = auth.user

        const sale = await Sale.findOrFail(params.id)

        const company = await Company.findOrFail(sale.company_id)

        if (id == company.creator_id) {

            const data = request.only([
                "quantity",
                "price"
            ])

            sale.merge(data)

            await sale.save()

            return sale
        } else {
            return response.status(401).send({ error: "Not authorized" })
        }
    }

    async destroy ({ params, response, auth }){
        const {id} = auth.user

        const sale = await Sale.findOrFail(params.id)

        const company = await Company.findOrFail(sale.company_id)

        if (id == company.creator_id) {

            await sale.delete()

            return response.status(200).send({ message: `Sale with id ${params.id} deleted`})
        } else {
            return response.status(401).send({ error: "Not authorized" })
        }
    }
}

module.exports = SaleController
