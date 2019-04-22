class Category < ApplicationRecord
  include Swagger::Blocks

  has_unique_identifier :g_identifier, segment_count: 3, segment_size: 2, delimiter: '-'

  swagger_schema :CategoryJSON do
    key :required, [:id]

    property :id do
      key :type, :integer
    end

    property :name do
      key :type, :string
    end

    property :displayName do
      key :type, :string
      key :description, 'virtual field, name for displaying a record in the UI'
    end

    property :parentId do
      key :type, :integer
      key :description, 'self reference to ID of parent category'
    end

    property :parentName do
      key :type, :string
      key :description, 'virtual field, references name of parent category'
    end

    property :productsCount do
      key :type, :integer
      key :description, 'counter cache for product records'
    end
  end

  swagger_schema :CategoryOption do
    property :value do
      key :type, :integer
      key :description, 'references ID field'
    end

    property :text do
      key :type, :string
      key :description, 'references name field'
    end
  end

  swagger_schema :CategoryCount do
    property :count do
      key :type, :integer
    end
  end

  swagger_schema :CategoryCreate do
    property :name do
      key :type, :string
    end

    property :parentId do
      key :type, :integer
    end
  end

  swagger_schema :CategoryUpdate do
    property :id do
      key :type, :integer
    end

    property :name do
      key :type, :string
    end

    property :parentId do
      key :type, :integer
    end
  end

  belongs_to :parent, class_name: 'Category', required: false
  has_many :products, dependent: :destroy

  delegate :name, to: :parent, prefix: true, allow_nil: true

  alias_attribute :text, :name
  alias_attribute :value, :id

  alias_attribute :parentId, :parent_id
  alias_attribute :parentName, :parent_name

  alias_attribute :productsCount, :products_count

  def displayName
    display_name = g_identifier ? "[#{g_identifier}] #{name}" : name
    parent.present? ? "#{parent.displayName} > #{display_name}" : display_name
  end

  def as_json(options = {})
    super(
      options.keys.any? ? options : {
        only: [:id, :name],
        methods: [:displayName, :parentId, :parentName, :productsCount]
      }
    )
  end

end
