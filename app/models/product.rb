class Product < ApplicationRecord
  belongs_to :category, counter_cache: true

  has_unique_identifier :p_identifier, segment_count: 2, segment_size: 3, delimiter: '/'

  validates :name, presence: true

  alias_attribute :text, :name
  alias_attribute :value, :id

  alias_attribute :categoryId, :category_id
  alias_attribute :categoryName, :category_name
  alias_attribute :displayCurrency, :display_currency

  delegate :name, to: :category, prefix: true

  after_create :adjust_unique_identifier

  def as_json(options = {})
    super(
      options.keys.any? ? options : {
        only: [:id, :name, :currency, :price],
        methods: [:displayName, :categoryId, :categoryName, :displayCurrency],
      }
    )
  end

  def displayName
    display_name = p_identifier ? "[#{p_identifier}] #{name}" : name
  end

  private

  def adjust_unique_identifier
   self.p_identifier = self.p_identifier[0..5]
   self.save
  end
end
