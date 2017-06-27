class AddProgramIdToApplicants < ActiveRecord::Migration[5.1]
  def up
    execute <<-SQL
      UPDATE Applications app, Applicants apl
      SET apl.program_id=app.program_id
      WHERE app.applicant_id = apl.id;
    SQL
  end

  def change
    add_column :applicants, :program_id, :string
  end
end
