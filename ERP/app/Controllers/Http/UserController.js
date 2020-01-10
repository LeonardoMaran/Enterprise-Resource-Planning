'use strict'

const User = use("App/Models/User")

/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */

class UserController {

    async index () {
        return User.all()
    }

    async store ({ request, response }) {
        const user = request.only([
            "username",
            "email",
            "password"
        ])

        if (await User.findBy("username", user.username)) {
            return response
                    .status(400)
                    .send({ error: "username already in use" })
        }

        if (await User.findBy("email", user.email)) {
            return response
                    .status(400)
                    .send({ error: "user already exists" })
        }

        const data = await User.create(user)

        return data

    }

    async show ({ params }){
        const data = await User.findOrFail(params.id)

        await data.load('companies')

        return data
    }

    async update ({ request, response, params, auth }){
        const {id} = auth.user

        if (id == params.id) {
            const user = await User.findOrFail(params.id)

            const data = request.only([
                "username",
                "email",
                "password"
            ])

            user.merge(data)

            await user.save()

            return user
        } else {
            return response.status(401).send({ error: "Not authorized" })
        }
    }

    async destroy ({ params, response, auth }){
        const {id} = auth.user
        
        if (id == params.id){
            const user = await User.findOrFail(params.id)

            await user.delete()

            return response.status(200).send({ message: `User by id ${params.id} deleted`})
        } else {
            return response.status(401).send({ error: "Not authorized" })
        }
    }
}

module.exports = UserController
