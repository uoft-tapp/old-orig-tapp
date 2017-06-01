class CreatePositions < ActiveRecord::Migration[5.1]
  def change
    create_table :positions do |t|
      t.references :course, foreign_key: true
      t.text :title
      t.text :duties
      t.text :qualifications
      t.integer :hours
      t.integer :estimated_count
      t.integer :estimated_total_hours

      t.timestamps
    end
  end
end
