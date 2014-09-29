class FacebookPagesController < ApplicationController
  def index

    clear_p = clear_params(params)

    @permalink   = URI.join(root_url,clear_p["permalink"])
    @type        = clear_p["type"]
    @title       = clear_p["title"]
    @description = clear_p["description"]

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

  def clear_params(p)
    JSON.parse(
      Base64.decode64(
        URI.decode(
          p[:base64Params]
        )
        .gsub('-','+')
        .gsub('_','/')
      )
      .force_encoding('iso-8859-1').encode('utf-8')
    )
  end

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
