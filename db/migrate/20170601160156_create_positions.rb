class CreatePositions < ActiveRecord::Migration[5.1]
  def change
    create_table :positions do |t|
      t.string :position, index: true, null: false
      t.integer :round_id, index: true, null: false
      t.boolean :open, index: true, null: false
      t.integer :campus_code, foreign_key: true, index: true, null: false
      t.text :course_name
      t.integer :estimated_enrolment
      t.text :duties
      t.text :qualifications
      t.integer :hours
      t.integer :estimated_count
      t.integer :estimated_total_hours

      t.timestamps
    end
    remove_index :positions, :position
    add_index :positions, :position, unique: true
  end
end
