class AddPIdentifierToProducts < ActiveRecord::Migration[5.2]
  def change
    add_column :products, :p_identifier, :string
  end
end
