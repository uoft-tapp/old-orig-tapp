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

  context "when importing applicants" do
    context "from a file missing applicants key" do
      let (:mock_json) {'{"courses" : []}'}
      it "raises a descriptive error" do
        expect { subject }.to raise_error(KeyError, /key not found: "applicants"/)
      end
    end

    context "from a file with no applicants" do
      let (:mock_json) { File.read("./spec/support/chass_data/no_applicant.json") }
      it "does not raise any errors" do
        expect {subject}.to_not raise_error
      end
    end

    context "from a file with a non-UtorID applicant" do
      let (:mock_json) { File.read("./spec/support/chass_data/no_utorid_applicant.json") }
      it "raises ActiveRecord::NotNullViolation exception" do
        expect { subject }.to raise_error(ActiveRecord::NotNullViolation,
          /PG::NotNullViolation: ERROR:  null value in column "utorid" violate/)
      end
    end

    context "from an expected file" do
      let (:mock_json) { File.read("./spec/support/chass_data/applicant.json") }
      before(:each) do
        # Sanity checking -- shouldn't ever fail
        expect(Applicant.all.count).to eq(0)
      end
      before(:each) { subject } # Evaluate subject

      it "creates an applicant record" do
        expect(Applicant.where(utorid: "applicant478").count).to eq(1)
      end

      it "sets fields on the applicant record" do
        expect(Applicant.first.attributes.symbolize_keys).to include({
          utorid: "applicant478",
          student_number: "1425362850",
          first_name: "Luklorizur",
          last_name: "Mrokarczur",
          email: "luklorizur.mrokarczur@mail.utoronto.ca",
          phone: "6476879273",
          address: "478 Karczur St.",
        })

      end

      let (:mock_json) { File.read("./spec/support/chass_data/applicant.json") }
      it "does not duplicate applicant records" do
        # IDEA: run the importer a second time, check number of applicants is the same
        expect(Applicant.where(utorid: "applicant478").count).to eq(1)
      end
    end
  end

  context "when importing applications" do
    context "from a file with duplicate app_id" do
      let (:mock_json) { File.read("./spec/support/chass_data/duplicate_app_id_applicant.json") }
      it "raise a descriptive error" do
        expect { subject }.to raise_error(ActiveRecord::RecordNotUnique,
          /PG::UniqueViolation: ERROR:  duplicate key value violates unique con/)
      end
    end

    context "from an expected file" do
      let (:mock_json) { File.read("./spec/support/chass_data/applicant.json") }
      before(:each) do
        # Sanity checking -- shouldn't ever fail
        expect(Application.all.count).to eq(0)
      end
      before(:each) { subject } # Evaluate subject

      it "creates an applicant record" do
        applicant = Applicant.where(utorid: "applicant478").pluck(:id).first
        expect(Application.where({applicant_id: applicant, app_id: 478}).count).to eq(1)
      end

      it "sets fields on the applicant record" do
        applicant = Applicant.where(utorid: "applicant478").pluck(:id).first
        expect(Application.first.attributes.symbolize_keys).to include({
          applicant_id: applicant,
          app_id: "478",
          round_id: "110",
          ta_experience: "CSC321H1S (1), CSC258H5S (5), CSC300H1S (3), CSC209H1S (2), CSC148H5S (9)",
          research: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut eget dignissim sem. Curabitur at semper eros. Aenean nec sem lobortis, scelerisque mi at, aliquam diam. Mauris malesuada elit nibh, sed hendrerit nulla mattis sed. Mauris laoreet imperdiet dictum. Pellentesque risus nulla, varius ut massa ut, venenatis fringilla sapien. Cras eget euismod augue, eget dignissim erat. Cras nec nibh ullamcorper ante rutrum dapibus sed nec tellus. In hac habitasse platea dictumst. Suspendisse semper tellus ac sem tincidunt auctor.",
          comments: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut eget dignissim sem. Curabitur at semper eros. Aenean nec sem lobortis, scelerisque mi at, aliquam diam. Mauris malesuada elit nibh, sed hendrerit nulla mattis sed. Mauris laoreet imperdiet dictum. Pellentesque risus nulla, varius ut massa ut, venenatis fringilla sapien. Cras eget euismod augue, eget dignissim erat. Cras nec nibh ullamcorper ante rutrum dapibus sed nec tellus. In hac habitasse platea dictumst. Suspendisse semper tellus ac sem tincidunt auctor.",
          availability: "",
          degrees: "Physics",
          work_experience: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut eget dignissim sem. Curabitur at semper eros. Aenean nec sem lobortis, scelerisque mi at, aliquam diam. Mauris malesuada elit nibh, sed hendrerit nulla mattis sed. Mauris laoreet imperdiet dictum. Pellentesque risus nulla, varius ut massa ut, venenatis fringilla sapien. Cras eget euismod augue, eget dignissim erat. Cras nec nibh ullamcorper ante rutrum dapibus sed nec tellus. In hac habitasse platea dictumst. Suspendisse semper tellus ac sem tincidunt auctor.",
          hours_owed: 7,
          pref_session: "Y",
          pref_campus: "St. George",
          deferral_status: nil,
          deferral_reason: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut eget dignissim sem. Curabitur at semper eros. Aenean nec sem lobortis, scelerisque mi at, aliquam diam. Mauris malesuada elit nibh, sed hendrerit nulla mattis sed. Mauris laoreet imperdiet dictum. Pellentesque risus nulla, varius ut massa ut, venenatis fringilla sapien. Cras eget euismod augue, eget dignissim erat. Cras nec nibh ullamcorper ante rutrum dapibus sed nec tellus. In hac habitasse platea dictumst. Suspendisse semper tellus ac sem tincidunt auctor.",
          appointment_number: nil,
        })
      end

      let (:mock_json) { File.read("./spec/support/chass_data/applicant.json") }
      it "does not duplicate application records" do
        # IDEA: run the importer a second time, check number of application is the same
        applicant = Applicant.where(utorid: "applicant478").pluck(:id).first
        expect(Application.where({applicant_id: applicant, app_id: 478}).count).to eq(1)
      end
    end
  end

  context "when importing into Preference model" do
    context "from an expected file" do
      let (:mock_json) { File.read("./spec/support/chass_data/applicant.json") }
      before(:each) do
          # Sanity checking -- shouldn't ever fail
        expect(Applicant.all.count).to eq(0)
      end
      before(:each) { subject } # Evaluate subject

      it "updates the course positions specified in preferences from rank 2 to the described rank" do
        applicant = Applicant.where(utorid: "applicant478").take
        application ||= applicant.applications.take
        position_id = Position.where(title: "CSC100H1S").select(:id).take.id
        rank ||= application.preferences.select(:rank).take.rank
        expect(rank).to eq(1)
      end
    end

    context "from file with non-existent course positions in courses" do
      let (:mock_json) { File.read("./spec/support/chass_data/nonexistent_course_position_applicant.json") }
      before(:each) do
          # Sanity checking -- shouldn't ever fail
        expect(Applicant.all.count).to eq(0)
      end
      before(:each) { subject } # Evaluate subject

      it "insert only the existent positions to Preference model" do
        applicant = Applicant.where(utorid: "applicant478").take
        application = applicant.applications.take
        position_id = Position.where(title: "CSC100H1S").select(:id).take.id
        preferences ||= application.preferences
        expect(preferences.count).to eq(1)
      end

    end

    context "from file with non-existent course positions in preferences" do
      let (:mock_json) { File.read("./spec/support/chass_data/nonexistent_course_position_applicant_pref.json") }
      before(:each) do
          # Sanity checking -- shouldn't ever fail
        expect(Applicant.all.count).to eq(0)
      end
      before(:each) { subject } # Evaluate subject

      it "insert only the existent positions to Preference model" do
        applicant = Applicant.where(utorid: "applicant478").take
        application = applicant.applications.take
        position_id = Position.where(title: "CSC100H1S").select(:id).take.id
        preferences ||= application.preferences
        expect(preferences.count).to eq(1)
      end
    end
  end

end
