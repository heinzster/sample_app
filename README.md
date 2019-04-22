[![Build Status](https://travis-ci.org/atroppmann/shoppu.svg?branch=master)](https://travis-ci.org/atroppmann/shoppu)

# DESCRIPTION

This project is a basic CRUD application based on a Ruby on Rails backend that delivers data as JSON via REST.
The frontend is built on React JS and Semantic UI.

# REQUIREMENTS

* Ruby 2.4.4
* TypeScript 3.1.3
* Postgresql 9.6
* React 16.5.2
* Semantic UI React 0.83.0
* MobX 5.5.1

# SYSTEM ARCHITECTURE

* Provides JS console logger service during development
* Implements a generic store inspired by Rails.
* Distinguishes between UI and domain stores.
* Uses `axios` as transport layer to consume Rails REST API.
* Implements a simple own routing service to switch between model modules
* Uses higher order components to push domain data from store into UI components.
* UI components are stateless and have bo access to stores.
* Uses modal dialogs for CRUD features
* Built on Semantic UI React.
* Provides notification service to show basic flash messages from Rails backend.

# LIVE DEMO

Visit https://heinz-uuid.herokuapp.com/ to see live demo. As this is a free Heroku account please be patient during spin-up of the virtual server.

# API DOCS

Visit https://heinz-uuid.herokuapp.com/swagger.html to see REST API documentation build with Swagger.

# BUILD PROCESS

This project is configured for use with Travis CI on Github.

# INSTALLATION

First of all you need a Postgres database, see `database.yml` for setting up user and password.

To get the project up and ready for running follow these command line statements after checkout from Git from the project root directory.
For `development` and `production` environments there will be records created using the Faker gem. Development database population doesn't
need much time, but be patient for production seeds. See `db/seeds.rb` for details

```
bundle install
bundle exec rails webpacker:install
rake db:setup
```

To build a production database you can use:

```
export RAILS_ENV=production
rake db:setup
```


To run the tests just enter this command:

```
rake test
```

For development you need to run the backend and frontend services:

```
rails s
./bin/webpack-dev-server --hot --host 127.0.0.1
```

For production mode use:

```
RAILS_ENV=production
NODE_ENV=production
bundle exec rails assets:precompile
rails s
```

Open your browser and visit `http://localhost:3000/pages/index` to see the Semantic UI frontend.
