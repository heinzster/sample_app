class AddGIdentifierToCategories < ActiveRecord::Migration[5.2]
  def change
    add_column :categories, :g_identifier, :string
  end
end
