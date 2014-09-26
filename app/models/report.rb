class Report
  include Mongoid::Document
  field :description, type: String

  belongs_to :reporter, class_name: "User", inverse_of: "reported_comments"

  after_save :send_report_email

  validates_presence_of :reporter, :description

end
