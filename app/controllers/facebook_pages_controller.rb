class FacebookPagesController < ApplicationController
  def index

    clear_params = JSON.parse(Base64.decode64(params[:base64Params]))

    @permalink   = URI.join(root_url,clear_params["permalink"])
    @type        = clear_params["type"]
    @title       = clear_params["title"]
    @description = clear_params["description"]

    @metas = {
      "og:title"       => @title,
      "og:site_name"   => "Shapter",
      "og:url"         => request.original_url,
      "og:description" => @description,
      "og:image"       => image_meta,
      "fb:app_id"      => FACEBOOK_APP_TOKEN,
      "og:type"        => "article",
    }

  end

  protected

  def image_meta

    if @type == "best_comments"
      URI.join(root_url,'/api/v1/', ActionController::Base.helpers.asset_path("logo_shapter_blue.png")[1..-1]) # for some reason, the first '/' character of image path crashes everything
    elsif @type == "item"
      URI.join(root_url,'/api/v1/', ActionController::Base.helpers.asset_path("diag_no_caption.png")[1..-1]) # for some reason, the first '/' character of image path crashes everything
    elsif @type == "internship"
      URI.join(root_url,'/api/v1/', ActionController::Base.helpers.asset_path("stages.png")[1..-1]) # for some reason, the first '/' character of image path crashes everything
    else
      URI.join(root_url,'/api/v1/', ActionController::Base.helpers.asset_path("logo_shapter_blue.png")[1..-1]) # for some reason, the first '/' character of image path crashes everything
    end
  end


end
