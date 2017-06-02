class CreateCourses < ActiveRecord::Migration[5.1]
  def change
    create_table :courses, id: :string, primary_key: :code do |t|
      t.integer :campus_code, index: true, null: false
      t.references :instructor, foreign_key: true
      t.text :course_name
      t.integer :estimated_enrolment

      t.timestamps
    end

    add_foreign_key :courses, :campus, column: :campus_code, primary_key: :code
  end
end
