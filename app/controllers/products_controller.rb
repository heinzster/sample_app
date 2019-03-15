class ProductsController < ApplicationController

  # GET /products/count
  def count
    begin
      @count = Product.count

      render json: {count: @count}
    rescue Exception
      render json: {notification: {level: 'error', message: 'Cannot count @products: unknown error!'}}, status: :internal_server_error
    end
  end

  # GET /products
  def index
    begin
      @products = Product.includes(:category).order(:name)

      if params.include?(:query) && params[:query].to_s.length > 0
        @products = @products.where("name like '%#{params[:query]}%'")
      end

      if params.include?(:per_page) && params.include?(:page)
        limit  = params[:per_page].to_i
        offset = limit * (params[:page].to_i - 1)

        @products = @products.limit(limit)
        @products = @products.offset(offset) if offset > 0
      end

      render json: @products.as_json
    rescue Exception
      render json: {notification: {level: 'error', message: 'Cannot list products: unknown error!'}}, status: :internal_server_error
    end
  end

  # GET /products/:id
  def show
    begin
      @product = Product.find(params[:id])
      render json: @product.as_json
    rescue ActiveRecord::RecordNotFound
      render json: {notification: {level: 'error', message: 'Cannot show product: record not found!'}}, status: :not_found
    rescue Exception
      render json: {notification: {level: 'error', message: 'Cannot show product: unknown error!'}}, status: :internal_server_error
    end
  end

  # DELETE /products/:id
  def destroy
    begin
      @product = Product.find(params[:id]).destroy
      render json: @product.as_json
    rescue ActiveRecord::RecordNotFound
      render json: {notification: {level: 'error', message: 'Cannot destroy product: record not found!'}}, status: :not_found
    rescue Exception
      render json: {notification: {level: 'error', message: 'Cannot destroy product: unknown error!'}}, status: :internal_server_error
    end
  end

  # PUT /products/:id
  def update
    begin
      @product = Product.find(params[:id])

      if @product.update_attributes(employee_params)
        render json: @product.as_json
      else
        render json: {notification: {level: 'error', message: 'Cannot update product!'}}, status: :not_acceptable
      end
    rescue ActiveRecord::RecordNotFound
      render json: {notification: {level: 'error', message: 'Cannot delete product: record not found!'}}, status: :not_found
    rescue Exception
      render json: {notification: {level: 'error', message: 'Cannot delete product: unknown error!'}}, status: :internal_server_error
    end
  end

  # POST /products
  def create
    begin
      @product = Product.new(employee_params)

      if @product.save
        render json: @product.as_json
      else
        render json: {notification: {level: 'error', message: 'Cannot create product!'}}, status: :not_acceptable
      end
    rescue Exception
      render json: {notification: {level: 'error', message: 'Cannot delete product: unknown error!'}}, status: :internal_server_error
    end
  end

  # GET /products/options
  def options
    begin
      @products = Product.order(:name)
      render json: @products.as_json(only: [], methods: [:value, :text])
    rescue Exception
      render json: {notification: {level: 'error', message: 'Cannot fetch products: unknown error!'}}, status: :internal_server_error
    end
  end
  
  private

  def employee_params
    params.require(:product).permit(:categoryId, :name, :price, :currency, :displayCurrency)
  end

end