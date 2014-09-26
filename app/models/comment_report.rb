class CommentReport < Report

  field :comment_id
  field :item_id

  validates_presence_of :comment_id, :item_id

  def comment
    Item.find(item_id).comments.find(comment_id)
  end

  protected

  def send_report_email
    ReportCommentMailer.report_comment_email(self).deliver
  end

end
