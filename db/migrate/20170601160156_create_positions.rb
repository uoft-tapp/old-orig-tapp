class CreatePositions < ActiveRecord::Migration[5.1]
  def change
    create_table :positions do |t|
      t.string :course_code, index: true, null: false
      t.text :title
      t.text :duties
      t.text :qualifications
      t.integer :hours
      t.integer :estimated_count
      t.integer :estimated_total_hours

      t.timestamps
    end

    add_foreign_key :positions, :courses, column: :course_code, primary_key: :code
  end
end
