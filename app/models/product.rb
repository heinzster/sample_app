class Product < ApplicationRecord
  belongs_to :category, counter_cache: true

  validates :name, presence: true

  alias_attribute :text, :name
  alias_attribute :value, :id

  alias_attribute :displayName, :name
  alias_attribute :categoryId, :category_id
  alias_attribute :categoryName, :category_name
  alias_attribute :displayCurrency, :display_currency

  delegate :name, to: :category, prefix: true

  def as_json(options = {})
    super(
      options.keys.any? ? options : {
        only: [:id, :name, :currency, :price],
        methods: [:displayName, :categoryId, :categoryName, :displayCurrency],
      }
    )
  end
end
