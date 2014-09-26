module FacebookPagesHelper

  def display_metas(metas)
    metas.map do |k,v|
      "<meta property=\"#{k}\" content=\"#{v}\"/>"
    end.join("\n")
  end

end
