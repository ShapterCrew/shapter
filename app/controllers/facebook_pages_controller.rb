class FacebookPagesController < ApplicationController
  def index

    clear_params = JSON.parse(Base64.decode64(params[:base64Params]))

    @permalink   = URI.join(root_url,clear_params["permalink"])
    @type        = clear_params["type"]
    @title       = clear_params["title"]
    @description = clear_params["description"]

    @metas = {
      "og:title"       => clear_params["title"],
      "og:site_name"   => "Shapter",
      "og:url"         => @permalink,
      "og:description" => clear_params["description"],
      "og:image"       => image_meta,
      "fb:app_id"      => FACEBOOK_APP_TOKEN,
      "og:type"        => "article",
    }

  end

  protected

  def image_meta
    if @type == "best_comments"
      URI.join(root_url, ActionController::Base.helpers.asset_path("logo_shapter_blue.png"))
    elsif @type == "item"
      URI.join(root_url, ActionController::Base.helpers.asset_path("logo_shapter_blue.png"))
    elsif @type == "internship"
      URI.join(root_url, ActionController::Base.helpers.asset_path("logo_shapter_blue.png"))
    else
      URI.join(root_url, ActionController::Base.helpers.asset_path("logo_shapter_blue.png"))
    end
  end


end
