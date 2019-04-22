# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# Note that this schema.rb definition is the authoritative source for your
# database schema. If you need to create the application database on another
# system, you should be using db:schema:load, not running all the migrations
# from scratch. The latter is a flawed and unsustainable approach (the more migrations
# you'll amass, the slower it'll run and the greater likelihood for issues).
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema.define(version: 2019_04_22_130400) do

  # These are extensions that must be enabled in order to support this database
  enable_extension "pgcrypto"
  enable_extension "plpgsql"
  enable_extension "uuid-ossp"

  create_table "categories", id: :uuid, default: -> { "gen_random_uuid()" }, force: :cascade do |t|
    t.uuid "parent_id"
    t.string "name"
    t.integer "products_count"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.string "g_identifier"
    t.index ["name"], name: "index_categories_on_name", unique: true
    t.index ["parent_id"], name: "index_categories_on_parent_id"
  end

  create_table "products", id: :uuid, default: -> { "gen_random_uuid()" }, force: :cascade do |t|
    t.uuid "category_id"
    t.string "name"
    t.decimal "price"
    t.string "currency", default: "EUR"
    t.string "display_currency", default: "EUR"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.string "p_identifier"
    t.index ["category_id"], name: "index_products_on_category_id"
  end

  add_foreign_key "products", "categories"
end
