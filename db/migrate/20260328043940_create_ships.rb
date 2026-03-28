class CreateShips < ActiveRecord::Migration[8.0]
  def change
    create_table :ships do |t|
      t.string :name
      t.integer :status
      t.integer :current_step
      t.jsonb :build_data

      t.timestamps
    end
  end
end
