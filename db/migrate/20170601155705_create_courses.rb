class CreateCourses < ActiveRecord::Migration[5.1]
  def change
    create_table :courses, id: false do |t|
      t.string :course_code, primary: true
      t.references :campus, foreign_key: true, null: false
      t.references :instructor, foreign_key: true
      t.text :course_name
      t.integer :estimated_enrolment

      t.timestamps
    end
  end
end
