class ReportCommentMailer < ActionMailer::Base
  default from: "report@shapter.com"

  def report_comment_email(comment_report)
    @reporter_email     = comment_report.reporter.email
    @report_description = comment_report.description
    @comment_body       = comment_report.comment.content
    @comment_id = {
      item_id: comment_report.item_id.to_s,
      comment_id: comment_report.comment_id,
    }
    mail(
      to: "moderate@shapter.com",
      subject: "[COMMENT REPORT] #{comment_report.id}",
    )
  end

end
