'use strict'

const Client = use("App/Models/Client")
const Company = use("App/Models/Company")

/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */

class ClientController {

    async store ({ request, response, params, auth }) {
        const client = request.only("name")

        const company = await Company.findOrFail(params.id)

        if (auth.user.id == company.creator_id) {

            const data = await Client.create({...client, company_id: params.id, created_by: auth.user.id})

            return data
        } else {
            return response.status(401).send({ error: "Not authorized" })
        }
    }

    async update ({ request, response, params, auth }){
        const {id} = auth.user

        const company = await Company.findOrFail(params.company_id)

        if (id == company.creator_id) {
            const client = await Client.findOrFail(params.id)

            const data = request.only("name")

            client.merge(data)

            await client.save()

            return client
        } else {
            return response.status(401).send({ error: "Not authorized" })
        }
    }

    async destroy ({ params, response, auth }){
        const {id} = auth.user

        const company = await Company.findOrFail(params.company_id)

        if (id == company.creator_id) {
            const client = await Client.findOrFail(params.id)

            await client.delete()

            return response.status(200).send({ message: `Client by id ${params.id} deleted`})
        } else {
            return response.status(401).send({ error: "Not authorized" })
        }
    }
}

module.exports = ClientController
