class CategoriesController < ApplicationController
  include Swagger::Blocks

  # GET /categories/count

  swagger_path '/categories/count' do
    operation :get do
      key :summary, 'Total number of all categories'
      key :description, 'Returns count for all categories'
      key :operationId, 'countCategories'

      key :tags, [
        'category'
      ]

      response 200 do
        key :description, 'counter response'

        schema do
          key :'$ref', :CategoryCount
        end
      end

      response :default do
        key :description, 'unknown error'
      end
    end
  end

  def count
    begin
      @count = Category.count
      render json: {count: @count}
    rescue Exception
      render json: {notification: {level: 'error', message: 'Cannot count categories: unknown error!'}}, status: :internal_server_error
    end
  end

  # GET /categories

  swagger_path '/categories' do
    operation :get do
      key :summary, 'Fetch all categories'
      key :description, 'Returns all categories, includes support for pagination and basic fulltext search'
      key :operationId, 'findCategories'

      key :tags, [
        'category'
      ]

      parameter do
        key :name, :query
        key :in, :query
        key :description, 'search term to filter results by'
        key :required, false
        key :type, :string
      end

      parameter do
        key :name, :per_page
        key :in, :query
        key :description, 'maximum number of results to return, used for pagination'
        key :required, false
        key :type, :integer
      end

      parameter do
        key :name, :page
        key :in, :query
        key :description, 'selected results page, used for pagination'
        key :required, false
        key :type, :integer
      end

      response 200 do
        key :description, 'category response'

        schema do
          key :type, :array

          items do
            key :'$ref', :CategoryJSON
          end
        end
      end

      response :default do
        key :description, 'unknown error'
      end
    end
  end

  def index
    begin
      @categories = Category.order(:id)

      if params.include?(:query) && params[:query].to_s.length > 0
        @categories = @categories.where("name like '%#{params[:query]}%'")
      end

      if params.include?(:per_page) && params.include?(:page)
        limit = params[:per_page].to_i
        offset = limit * (params[:page].to_i - 1)

        @categories = @categories.limit(limit)
        @categories = @categories.offset(offset) if offset > 0
      end

      render json: @categories.as_json
    rescue Exception
      render json: {notification: {level: 'error', message: 'Cannot list categories: unknown error!'}}, status: :internal_server_error
    end
  end

  # GET /categories/:id

  swagger_path '/categories/{id}' do
    operation :get do
      key :summary, 'Find category by ID'
      key :description, 'Returns a single category'
      key :operationId, 'findCategoryById'

      key :tags, [
        'category'
      ]

      parameter do
        key :name, :id
        key :in, :path
        key :description, 'ID of category to fetch'
        key :required, true
        key :type, :integer
      end

      response 200 do
        key :description, 'category response'

        schema do
          key :'$ref', :CategoryJSON
        end
      end

      response :not_found do
        key :description, 'no record found for submitted ID'
      end

      response :default do
        key :description, 'unknown error'
      end
    end
  end

  def show
    begin
      @category = Category.find(params[:id])
      render json: @category.as_json
    rescue ActiveRecord::RecordNotFound
      render json: {notification: {level: 'error', message: 'Cannot show category: record not found!'}}, status: :not_found
    rescue Exception
      render json: {notification: {level: 'error', message: 'Cannot show category: unknown error!'}}, status: :internal_server_error
    end
  end

  # DELETE /categories/:id

  swagger_path '/categories/{id}' do
    operation :delete do
      key :summary, 'Delete category by ID'
      key :description, 'Removes a single category from database'
      key :operationId, 'removeCategoryById'

      key :tags, [
        'category'
      ]

      parameter do
        key :name, :id
        key :in, :path
        key :description, 'ID of category to delete'
        key :required, true
        key :type, :integer
      end

      response 200 do
        key :description, 'category response (returns the record that has been destroyed)'

        schema do
          key :'$ref', :CategoryJSON
        end
      end

      response :not_found do
        key :description, 'no record found for submitted ID'
      end

      response :default do
        key :description, 'unknown error'
      end
    end
  end

  def destroy
    begin
      @category = Category.find(params[:id]).destroy
      render json: @category.as_json
    rescue ActiveRecord::RecordNotFound
      render json: {notification: {level: 'error', message: 'Cannot destroy category: record not found!'}}, status: :not_found
    rescue Exception
      render json: {notification: {level: 'error', message: 'Cannot destroy category: unknown error!'}}, status: :internal_server_error
    end
  end

  # PUT /categories/:id

  swagger_path '/categories/{id}' do
    operation :put do
      key :summary, 'Modify existing category'
      key :description, 'Updates an existing category and stores the record in the database after model validation'
      key :operationId, 'updateCategory'

      key :tags, [
        'category'
      ]

      parameter do
        key :name, :category
        key :in, :body
        key :description, 'Category data to update'
        key :required, true

        schema do
          key :'$ref', :CategoryUpdate
        end
      end

      response 200 do
        key :description, 'category response'

        schema do
          key :'$ref', :CategoryJSON
        end
      end

      response :not_found do
        key :description, 'no record found for submitted ID'
      end

      response :default do
        key :description, 'unknown error'
      end
    end
  end

  def update
    begin
      @category = Category.find(params[:id])

      if @category.update_attributes(company_params)
        render json: @category.as_json
      else
        render json: {notification: {level: 'error', message: 'Cannot update category!'}}, status: :not_acceptable
      end
    rescue ActiveRecord::RecordNotFound
      render json: {notification: {level: 'error', message: 'Cannot delete category: record not found!'}}, status: :not_found
    rescue Exception
      render json: {notification: {level: 'error', message: 'Cannot delete category: unknown error!'}}, status: :internal_server_error
    end
  end

  # POST /categories

  swagger_path '/categories' do
    operation :post do
      key :summary, 'Add new category'
      key :description, 'Creates a new category and stores the record in the database after model validation'
      key :operationId, 'addCategory'

      key :tags, [
        'category'
      ]

      parameter do
        key :name, :category
        key :in, :body
        key :description, 'Category to add'
        key :required, true

        schema do
          key :'$ref', :CategoryCreate
        end
      end

      response 200 do
        key :description, 'category response'

        schema do
          key :'$ref', :CategoryJSON
        end
      end

      response :not_acceptable do
        key :description, 'model validation failed'
      end

      response :default do
        key :description, 'unknown error'
      end
    end
  end

  def create
    begin
      @category = Category.new(company_params)

      if @category.save
        render json: @category.as_json
      else
        render json: {notification: {level: 'error', message: 'Cannot create category!'}}, status: :not_acceptable
      end
    rescue Exception
      render json: {notification: {level: 'error', message: 'Cannot delete category: unknown error!'}}, status: :internal_server_error
    end
  end

  # GET /categories/options

  swagger_path '/categories/options' do
    operation :get do
      key :summary, 'Fetch all categories'
      key :description, 'Returns list of all categories for use with HTML select form field'
      key :operationId, 'categoriesAsSelectOptions'

      key :tags, [
        'category'
      ]

      response 200 do
        key :description, 'category response'

        schema do
          key :type, :array

          items do
            key :'$ref', :CategoryOption
          end
        end
      end

      response :default do
        key :description, 'unknown error'
      end
    end
  end

  def options
    begin
      @categories = Category.order(:name)
      render json: @categories.as_json(only: [], methods: [:value, :text])
    rescue Exception
      render json: {notification: {level: 'error', message: 'Cannot fetch categories: unknown error!'}}, status: :internal_server_error
    end
  end

  private

  def company_params
    params.require(:category).permit(:name, :parentId)
  end

end