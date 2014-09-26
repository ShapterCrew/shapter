class FacebookPagesController < ApplicationController
  def index
    @permalink   = URI.join(root_url,params[:permalink].gsub("%7C","/"))
    @type        = params[:type]
    @title       = params[:title]
    @description = params[:description]

    @metas = {
      "fb:app_id"      => FACEBOOK_APP_TOKEN,
      "og:site_name"   => "Shapter",
      "og:description" => params[:description],
      "og:title"       => params[:title],
      "og:url"         => @permalink,
      "og:image"       => image_meta,
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
