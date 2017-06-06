require 'rails_helper'

describe ChassImporter do
  let(:test_filename) { 'test/stub' }
  subject { ChassImporter.new(test_filename) }

  before :each do
    allow(File).to receive(:read).with(/#{test_filename}/).and_return(mock_json)
  end

  context "when used on an empty file" do
    let(:mock_json) { '' }
    it "raises a descriptive error" do
      expect { subject }.to raise_error(JSON::ParserError, /file is empty/)
    end
  end

  context "when used on an invalid file" do
    let(:mock_json) { '<?xml version="1.0" encoding="UTF-8"?>' }
    it "raises a descriptive error" do
      expect { subject }.to raise_error(JSON::ParserError)
    end
  end

  context "when parsing courses" do
    context "from a file missing courses key" do
      let(:mock_json) { '{ "applicants": [] }' }
      it "raises a descriptive error" do
        expect { subject }.to raise_error(KeyError, /key not found/)
      end
    end

    context "with no round_id" do
      let(:mock_json) { '{ "courses": [],  "applicants": []}' }
      it "raises a descriptive error" do
        expect { subject }.to raise_error(StandardError, /no round_id/)
      end
    end

    context "with more than one round_id" do
      let(:mock_json) { File.read("./spec/support/chass_data/too_many_rounds.json") }
      it "raises a descriptive error" do
        expect { subject }.to raise_error(StandardError, /too many round_id/)
      end
    end

    context "with a plain course" do
      let(:mock_json) { File.read("./spec/support/chass_data/plain_course.json") }

      before(:each) do
        # Sanity checking -- shouldn't ever fail
        expect(Course.all.count).to eq(0)
        expect(Position.all.count).to eq(0)
      end

      before(:each) { subject } # Evaluate subject

      it "inserts a course and a default position" do
        expect(Course.where(code: "CSC100H1S").count).to eq(1)
        expect(Position.where(course_code: "CSC100H1S", title: "CSC100H1S").count).to eq(1)
      end

      it "sets the campus code appropriately" do
        expect(Course.first.campus_code).to eq(1)
      end

      it "sets the course name appropriately" do
        expect(Course.first.course_name).to eq("First Year Office Hour TA")
      end

      it "sets the estimated enrolment correctly" do
        expect(Course.first.estimated_enrolment).to eq(100)
      end

      it "sets the position attributes correctly" do
        expect(Position.first.attributes.symbolize_keys).to include({
          qualifications: "Must be enrolled in or have completed a computer science degree, or equivalent. Must meet the qualifications to TA *ALL* of CSC 108, 148, and 165 (see CSC108H1-B, CSC148H1, CSC165H1 qualifications). Enthusiasm and patience for face-to-face teaching of beginners is required. Experience with CSC 104 or Racket preferred.",
          duties: "Hold office hours on a weekly basis to assist students taking 100-level CSC courses.",
          hours: 54,
          estimated_count: 5,
          estimated_total_hours: nil
          })
      end
    end

    context "with a course listing multiple positions" do
      let(:mock_json) { File.read("./spec/support/chass_data/two_position_course.json") }
      before(:each) { subject } # Evaluate subject

      it "inserts the course and the positions" do
        expect(Course.where(code: "CSC108H1S").count).to eq(1)
        expect(Position.where(course_code: "CSC108H1S").pluck(:title).sort).to eq(["CSC108H1S - Head TA", "CSC108H1S - Student-Facing TA"])
      end

      it "correctly sets up the positions" do
        a_position = Position.where(title: "CSC108H1S - Head TA").take!
        expect(a_position.attributes.symbolize_keys).to include({
          estimated_count: 2,
          duties: "Assist course coordinator with TA management and course administration. Hold marking meetings on Friday afternoons. Mentor and provide feedback to other TAs."
          })


        other_position = Position.where(title: "CSC108H1S - Student-Facing TA").take!
        expect(other_position.attributes.symbolize_keys).to include({
          estimated_count: 19,
          duties: "Attend lectures to assist in classroom activities. Prepare for each week by doing online programming activities. Some TAs may hold office hours or monitor discussion forums."
          })
      end
    end
  end

  context "when run on the same file twice" do
    let(:mock_json) { File.read("./spec/support/chass_data/plain_course.json") }

    it "keeps calm" do
      ChassImporter.new(test_filename) # Run first time
      expect {
        ChassImporter.new(test_filename) # Run the second time
      }.to_not raise_error
    end

    it "doesn't modify Course records" do
      ChassImporter.new(test_filename)

      expect { # running importer for the second time to not change courses data
        ChassImporter.new(test_filename)
      }.to_not change { Course.all.to_a }
    end

    it "doesn't modify Position records" do
      ChassImporter.new(test_filename)

      expect {
        ChassImporter.new(test_filename)
      }.to_not change { Position.all.to_a }
    end
  end
end
