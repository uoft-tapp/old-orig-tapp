class AddYipToApplicants < ActiveRecord::Migration[5.1]
  def up
    execute <<-SQL
      UPDATE Applications app, Applicants apl
      SET apl.yip=app.yip
      WHERE app.applicant_id = apl.id;
    SQL
  end

  def change
    add_column :applicants, :yip, :integer
  end
end
