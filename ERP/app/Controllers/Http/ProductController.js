'use strict'

const Product = use("App/Models/Product")
const Company = use("App/Models/Company")

/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */

class ProductController {

    async index ({ params, response }) {
        
        try {
            const company = await Company.findOrFail(params.id)

            return company
                .products()
                .fetch()
        } catch (e) {
            return response.status(404)
        }
    }

    async store ({ request, response, params, auth }) {
        const product = request.only([
            "name", 
            "price"
        ])

        const company = await Company.findOrFail(params.id)

        if (auth.user.id == company.creator_id) {

            const data = await Product.create({...product, company_id: params.id, created_by: auth.user.id})

            return data
        } else {
            return response.status(401).send({ error: "Not authorized" })
        }
    }

    async show ({ params, response }) {
        try {
            
            const product = await Product.findOrFail(params.id)
            
            return product
        } catch (e) {
            return response.status(404).send(e)
        } 
    }

    async update ({ request, response, params, auth }) {
        const {id} = auth.user

        const product = await Product.findOrFail(params.id)

        const company = await Company.findOrFail(product.company_id)

        if (id == company.creator_id) {

            const data = request.only([
                "name",
                "price"
            ])

            product.merge(data)

            await product.save()

            return product
        } else {
            return response.status(401).send({ error: "Not authorized" })
        }
    }

    async destroy ({ params, response, auth }){
        const {id} = auth.user

        const product = await Product.findOrFail(params.id)

        const company = await Company.findOrFail(product.company_id)

        if (id == company.creator_id) {

            await product.delete()

            return response.status(200).send({ message: `Product with id ${params.id} deleted`})
        } else {
            return response.status(401).send({ error: "Not authorized" })
        }
    }
}

module.exports = ProductController
