class CreateCampus < ActiveRecord::Migration[5.1]
  def change
    create_table :campus, id: false do |t|
      t.integer :code, primary: true
      t.string :name, null: false
    end
  end
end
