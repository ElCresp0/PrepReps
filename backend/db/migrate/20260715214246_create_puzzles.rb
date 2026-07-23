class CreatePuzzles < ActiveRecord::Migration[8.1]
  def change
    create_table :puzzles do |t|
      t.string :title
      t.string :pgn
      t.references :user, null: false, foreign_key: true

      t.timestamps
    end

    add_index :puzzles, [ :user_id, :title ], unique: true
  end
end
