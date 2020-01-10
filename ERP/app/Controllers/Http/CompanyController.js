'use strict'

const Company = use("App/Models/Company")

/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

/**
 * Resourceful controller for interacting with companies
 */
class CompanyController {
  /**
   * Show a list of all companies.
   * GET companies
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async index () {
    const company = Company.all()

    return company
  }

  /**
   * Create/save a new company.
   * POST companies
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async store ({ request, response, auth }) {
    const data = request.only([
      "name"
    ])

    if (await Company.findBy("name", data.name)) {
      return response
              .status(400)
              .send({ error: "Company already exists" })
    }

    const company = await Company.create({ ...data, creator_id: auth.user.id })
    
    return company
  }

  /**
   * Display a single company.
   * GET companies/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async show ({ params, response }) {
    try {
      const company = await Company.findOrFail(params.id)

      await company.load('clients')

      return company
    } catch (e) {
      return response.status(404).send(e)
    }
  }

  /**
   * Update company details.
   * PUT or PATCH companies/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async update ({ params, request, response, auth }) {
    const {id} = auth.user

    const company = await Company.findOrFail(params.id)

    if (id == company.creator_id) {

      const data = request.only('name')

      if (await Company.findBy('name', data.name)){

        return response.status(400).send({ message: "Company name already in use" })
      } 
      company.merge(data)

      await company.save()

      return company
    } else {
      return response.status(401).send({ message: "Not authorized" })
    }
  }

  /**
   * Delete a company with id.
   * DELETE companies/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async destroy ({ params, response, auth }) {
    const {id} = auth.user

    const company = await Company.findOrFail(params.id)

    if (id == company.creator_id) {
      await company.delete()

      return response.status(200).send({ message: `Company with id ${params.id} deleted` })
    } else {
      return response.status(400).send({ error: "Not authorized" })
    }
  }
}

module.exports = CompanyController
