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

ActiveRecord::Schema.define(version: 20170621180840) do

  # These are extensions that must be enabled in order to support this database
  enable_extension "plpgsql"

  create_table "applicants", force: :cascade do |t|
    t.string "utorid", null: false
    t.string "student_number"
    t.string "first_name"
    t.string "last_name"
    t.string "email"
    t.string "phone"
    t.text "address"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["utorid"], name: "index_applicants_on_utorid", unique: true
  end

  create_table "applications", force: :cascade do |t|
    t.bigint "applicant_id"
    t.string "app_id", null: false
    t.text "ta_training"
    t.string "access_acad_history"
    t.string "dept"
    t.string "program_id"
    t.integer "yip"
    t.text "ta_experience"
    t.text "academic_qualifications"
    t.text "technical_skills"
    t.text "availability"
    t.text "other_info"
    t.text "special_needs"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["app_id"], name: "index_applications_on_app_id", unique: true
    t.index ["applicant_id"], name: "index_applications_on_applicant_id"
  end

  create_table "assignments", force: :cascade do |t|
    t.bigint "applicant_id"
    t.bigint "position_id"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.integer "hours"
    t.index ["applicant_id"], name: "index_assignments_on_applicant_id"
    t.index ["position_id"], name: "index_assignments_on_position_id"
  end

  create_table "campus", primary_key: "code", id: :serial, force: :cascade do |t|
    t.string "name", null: false
  end

  create_table "instructors", force: :cascade do |t|
    t.string "name"
    t.string "email"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  create_table "instructors_positions", id: false, force: :cascade do |t|
    t.bigint "instructor_id"
    t.bigint "position_id"
    t.index ["instructor_id"], name: "index_instructors_positions_on_instructor_id"
    t.index ["position_id"], name: "index_instructors_positions_on_position_id"
  end

  create_table "positions", force: :cascade do |t|
    t.string "position", null: false
    t.integer "round_id", null: false
    t.boolean "open", null: false
    t.integer "campus_code", null: false
    t.text "course_name"
    t.integer "estimated_enrolment"
    t.text "duties"
    t.text "qualifications"
    t.integer "hours"
    t.integer "estimated_count"
    t.integer "estimated_total_hours"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["campus_code"], name: "index_positions_on_campus_code"
    t.index ["open"], name: "index_positions_on_open"
    t.index ["position", "round_id"], name: "index_positions_on_position_and_round_id", unique: true
  end

  create_table "preferences", force: :cascade do |t|
    t.bigint "application_id"
    t.bigint "position_id"
    t.integer "rank"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["application_id"], name: "index_preferences_on_application_id"
    t.index ["position_id"], name: "index_preferences_on_position_id"
  end

  add_foreign_key "applications", "applicants"
  add_foreign_key "assignments", "applicants"
  add_foreign_key "assignments", "positions"
  add_foreign_key "preferences", "applications"
  add_foreign_key "preferences", "positions"
end
