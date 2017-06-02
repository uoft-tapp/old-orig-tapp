# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# Note that this schema.rb definition is the authoritative source for your
# database schema. If you need to create the application database on another
# system, you should be using db:schema:load, not running all the migrations
# from scratch. The latter is a flawed and unsustainable approach (the more migrations
# you'll amass, the slower it'll run and the greater likelihood for issues).
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema.define(version: 20170601160156) do

  # These are extensions that must be enabled in order to support this database
  enable_extension "plpgsql"

  create_table "campus", primary_key: "code", id: :serial, force: :cascade do |t|
    t.string "name", null: false
  end

  create_table "courses", primary_key: "code", id: :string, force: :cascade do |t|
    t.integer "campus_code", null: false
    t.bigint "instructor_id"
    t.text "course_name"
    t.integer "estimated_enrolment"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["campus_code"], name: "index_courses_on_campus_code"
    t.index ["instructor_id"], name: "index_courses_on_instructor_id"
  end

  create_table "instructors", force: :cascade do |t|
    t.string "name"
    t.string "email"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["email"], name: "index_instructors_on_email", unique: true
  end

  create_table "positions", force: :cascade do |t|
    t.string "course_code", null: false
    t.text "title"
    t.text "duties"
    t.text "qualifications"
    t.integer "hours"
    t.integer "estimated_count"
    t.integer "estimated_total_hours"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["course_code"], name: "index_positions_on_course_code"
  end

  add_foreign_key "courses", "campus", column: "campus_code", primary_key: "code"
  add_foreign_key "courses", "instructors"
  add_foreign_key "positions", "courses", column: "course_code", primary_key: "code"
end
