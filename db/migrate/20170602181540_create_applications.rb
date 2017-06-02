class CreateApplications < ActiveRecord::Migration[5.1]
  def change
    create_table :applications do |t|
      t.references :applicant, foreign_key: true
      t.string :app_id, null: false
      t.string :round_id, null: false
      t.text :ta_experience
      t.text :research
      t.text :comments
      t.text :availability
      t.text :degrees
      t.text :work_experience
      t.integer :hours_owed
      t.string :pref_session
      t.string :pref_campus
      t.text :deferral_status
      t.text :deferral_reason
      t.integer :appointment_number

      t.timestamps
    end
    add_index :applications, :app_id, unique: true
  end
end
