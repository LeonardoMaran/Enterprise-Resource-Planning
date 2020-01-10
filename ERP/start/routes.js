'use strict'

/*
|--------------------------------------------------------------------------
| Routes
|--------------------------------------------------------------------------
|
| Http routes are entry points to your web application. You can create
| routes for different URLs and bind Controller actions to them.
|
| A complete guide on routing is available here.
| http://adonisjs.com/docs/4.1/routing
|
*/

/** @type {typeof import('@adonisjs/framework/src/Route/Manager')} */
const Route = use('Route')

Route.get('/', () => {
  return { greeting: 'Hello world in JSON' }
})

Route.post('users', 'UserController.store')
Route.get('users', 'UserController.index')
Route.get('users/:id', 'UserController.show')
Route.put('users/:id', 'UserController.update')
  .middleware('auth')
Route.delete('users/:id', 'UserController.destroy')
  .middleware('auth')

Route.post('sessions', 'SessionController.login')

Route.resource('companies', 'CompanyController')
  .middleware('auth')
  .apiOnly()

Route.resource('companies/:id/clients', 'ClientController')
  .middleware('auth')
  .apiOnly()

Route.resource('companies/:id/products', 'ProductController')
  .middleware('auth')
  .apiOnly()
