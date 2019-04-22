class CreateProducts < ActiveRecord::Migration[5.2]
  def change
    create_table :products, id: :uuid do |t|
      t.references :category, foreign_key: true

      t.string :name
      t.decimal :price
      t.string :currency, default: 'EUR'
      t.string :display_currency, default: 'EUR'

      t.timestamps
    end
  end
end
