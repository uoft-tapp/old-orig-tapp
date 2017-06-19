class CreateTeaches < ActiveRecord::Migration[5.1]
  def change
    create_table :teaches do |t|
      t.references :position, foreign_key: true
      t.references :instructor, foreign_key: true

      t.timestamps
    end
  end
end
