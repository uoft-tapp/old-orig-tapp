class AddDeptToApplicants < ActiveRecord::Migration[5.1]
  def up
    execute <<-SQL
      UPDATE Applications app, Applicants apl
      SET apl.dept=app.dept
      WHERE app.applicant_id = apl.id;
    SQL
  end

  def change
    add_column :applicants, :dept, :string
  end
end
