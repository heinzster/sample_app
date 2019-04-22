class CreateCategories < ActiveRecord::Migration[5.2]
  def change
    create_table :categories, id: :uuid do |t|
      t.references :parent

      t.string :name, index: { unique: true }
      t.integer :products_count

      t.timestamps
    end
  end
end
