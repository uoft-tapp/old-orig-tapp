require 'rails_helper'

RSpec.describe AssignmentsController, type: :controller do
  let (:parsed_body) { JSON.parse(response.body) }

  describe "GET #index" do
    before(:each) do
      @course = Course.create!(
        code: "CSC411",
        campus_code: 1,
        instructor_id: nil,
        course_name: "Introduction to Software Testing",
        estimated_enrolment: 50
        )

      @position = Position.create!(
        course_code: "CSC411",
        title: "CSC411 - Head TA",
        duties: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut eget dignissim sem. Curabitur at semper eros. Aenean nec sem lobortis, scelerisque mi at, aliquam diam. Mauris malesuada elit nibh, sed hendrerit nulla mattis sed. Mauris laoreet imperdiet dictum. Pellentesque risus nulla, varius ut massa ut, venenatis fringilla sapien. Cras eget euismod augue, eget dignissim erat. Cras nec nibh ullamcorper ante rutrum dapibus sed nec tellus. In hac habitasse platea dictumst. Suspendisse semper tellus ac sem tincidunt auctor.",
        qualifications: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut eget dignissim sem. Curabitur at semper eros. Aenean nec sem lobortis, scelerisque mi at, aliquam diam. Mauris malesuada elit nibh, sed hendrerit nulla mattis sed. Mauris laoreet imperdiet dictum. Pellentesque risus nulla, varius ut massa ut, venenatis fringilla sapien. Cras eget euismod augue, eget dignissim erat. Cras nec nibh ullamcorper ante rutrum dapibus sed nec tellus. In hac habitasse platea dictumst. Suspendisse semper tellus ac sem tincidunt auctor.",
        hours: 22,
        estimated_count: 15,
        estimated_total_hours: 330
        )

      @applicant = Applicant.create!(
        utorid: "rocky145",
        student_number: 1234567890,
        first_name: "Landy",
        last_name: "Simpson",
        email: "simps@mail.com",
        phone: "416-555-8888",
        address: "100 Jameson Ave Toronto, ON M65-48H"
        )

      @application = @applicant.applications.create!(
        app_id: "-111",
        round_id: "-222",
        ta_experience: "CSC373H1S (2), CSC318H1S (5), CSC423H5S (4), CSC324H1S (9), CSC404H1S (8)",
        research: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut eget dignissim sem. Curabitur at semper eros. Aenean nec sem lobortis, scelerisque mi at, aliquam diam. Mauris malesuada elit nibh, sed hendrerit nulla mattis sed. Mauris laoreet imperdiet dictum. Pellentesque risus nulla, varius ut massa ut, venenatis fringilla sapien. Cras eget euismod augue, eget dignissim erat. Cras nec nibh ullamcorper ante rutrum dapibus sed nec tellus. In hac habitasse platea dictumst. Suspendisse semper tellus ac sem tincidunt auctor.",
        comments: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut eget dignissim sem. Curabitur at semper eros. Aenean nec sem lobortis, scelerisque mi at, aliquam diam. Mauris malesuada elit nibh, sed hendrerit nulla mattis sed. Mauris laoreet imperdiet dictum. Pellentesque risus nulla, varius ut massa ut, venenatis fringilla sapien. Cras eget euismod augue, eget dignissim erat. Cras nec nibh ullamcorper ante rutrum dapibus sed nec tellus. In hac habitasse platea dictumst. Suspendisse semper tellus ac sem tincidunt auctor.",
        availability: "MW 9-8, RF 12-7",
        degrees: "Computer Science",
        work_experience: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut eget dignissim sem. Curabitur at semper eros. Aenean nec sem lobortis, scelerisque mi at, aliquam diam. Mauris malesuada elit nibh, sed hendrerit nulla mattis sed. Mauris laoreet imperdiet dictum. Pellentesque risus nulla, varius ut massa ut, venenatis fringilla sapien. Cras eget euismod augue, eget dignissim erat. Cras nec nibh ullamcorper ante rutrum dapibus sed nec tellus. In hac habitasse platea dictumst. Suspendisse semper tellus ac sem tincidunt auctor.",
        hours_owed: 35,
        pref_session: "Y",
        pref_campus: "Mississauga",
        deferral_status: nil,
        deferral_reason: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut eget dignissim sem. Curabitur at semper eros. Aenean nec sem lobortis, scelerisque mi at, aliquam diam. Mauris malesuada elit nibh, sed hendrerit nulla mattis sed. Mauris laoreet imperdiet dictum. Pellentesque risus nulla, varius ut massa ut, venenatis fringilla sapien. Cras eget euismod augue, eget dignissim erat. Cras nec nibh ullamcorper ante rutrum dapibus sed nec tellus. In hac habitasse platea dictumst. Suspendisse semper tellus ac sem tincidunt auctor.",
        appointment_number: nil
        )

      @assignment = @applicant.assignments.create!(
        round_id: "110",
        position_id: @position.id,
        hours: 50
        )
    end

    context "when not passed an applicant ID" do
      it "lists assignments" do
        get :index
        expect(response.status).to eq(200)
        expect(parsed_body).not_to be_empty
      end
    end

    context "when passed an applicant ID" do
      it "lists assignments given an integer applicant ID" do
        get :index, params: { applicant_id: @applicant.id }, format: :json
        expect(response.status).to eq(200)
        expect(parsed_body).not_to be_empty
        expect(parsed_body).to include("assignments", @applicant.attributes.except("created_at", "updated_at"))
        expect(parsed_body["assignments"].first).to include(@assignment.attributes.except("created_at", "updated_at"))
        expect(parsed_body["assignments"].count).to eq(1)
      end
    end

    context "lists assignments given a non-integer applicant ID" do
      it "returns 404" do
        get :index, params: { applicant_id: "poop" }
        expect(response.status).to eq(404)
      end
    end
  end

  describe "GET #show" do
    before(:each) do
      @course = Course.create!(
        code: "CSC411",
        campus_code: 1,
        instructor_id: nil,
        course_name: "Introduction to Software Testing",
        estimated_enrolment: 50
        )

      @position = Position.create!(
        course_code: "CSC411",
        title: "CSC411 - Head TA",
        duties: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut eget dignissim sem. Curabitur at semper eros. Aenean nec sem lobortis, scelerisque mi at, aliquam diam. Mauris malesuada elit nibh, sed hendrerit nulla mattis sed. Mauris laoreet imperdiet dictum. Pellentesque risus nulla, varius ut massa ut, venenatis fringilla sapien. Cras eget euismod augue, eget dignissim erat. Cras nec nibh ullamcorper ante rutrum dapibus sed nec tellus. In hac habitasse platea dictumst. Suspendisse semper tellus ac sem tincidunt auctor.",
        qualifications: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut eget dignissim sem. Curabitur at semper eros. Aenean nec sem lobortis, scelerisque mi at, aliquam diam. Mauris malesuada elit nibh, sed hendrerit nulla mattis sed. Mauris laoreet imperdiet dictum. Pellentesque risus nulla, varius ut massa ut, venenatis fringilla sapien. Cras eget euismod augue, eget dignissim erat. Cras nec nibh ullamcorper ante rutrum dapibus sed nec tellus. In hac habitasse platea dictumst. Suspendisse semper tellus ac sem tincidunt auctor.",
        hours: 22,
        estimated_count: 15,
        estimated_total_hours: 330
        )

      @applicant = Applicant.create!(
        utorid: "rocky145",
        student_number: 1234567890,
        first_name: "Landy",
        last_name: "Simpson",
        email: "simps@mail.com",
        phone: "416-555-8888",
        address: "100 Jameson Ave Toronto, ON M65-48H"
        )

      @application = @applicant.applications.create!(
        app_id: "-111",
        round_id: "-222",
        ta_experience: "CSC373H1S (2), CSC318H1S (5), CSC423H5S (4), CSC324H1S (9), CSC404H1S (8)",
        research: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut eget dignissim sem. Curabitur at semper eros. Aenean nec sem lobortis, scelerisque mi at, aliquam diam. Mauris malesuada elit nibh, sed hendrerit nulla mattis sed. Mauris laoreet imperdiet dictum. Pellentesque risus nulla, varius ut massa ut, venenatis fringilla sapien. Cras eget euismod augue, eget dignissim erat. Cras nec nibh ullamcorper ante rutrum dapibus sed nec tellus. In hac habitasse platea dictumst. Suspendisse semper tellus ac sem tincidunt auctor.",
        comments: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut eget dignissim sem. Curabitur at semper eros. Aenean nec sem lobortis, scelerisque mi at, aliquam diam. Mauris malesuada elit nibh, sed hendrerit nulla mattis sed. Mauris laoreet imperdiet dictum. Pellentesque risus nulla, varius ut massa ut, venenatis fringilla sapien. Cras eget euismod augue, eget dignissim erat. Cras nec nibh ullamcorper ante rutrum dapibus sed nec tellus. In hac habitasse platea dictumst. Suspendisse semper tellus ac sem tincidunt auctor.",
        availability: "MW 9-8, RF 12-7",
        degrees: "Computer Science",
        work_experience: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut eget dignissim sem. Curabitur at semper eros. Aenean nec sem lobortis, scelerisque mi at, aliquam diam. Mauris malesuada elit nibh, sed hendrerit nulla mattis sed. Mauris laoreet imperdiet dictum. Pellentesque risus nulla, varius ut massa ut, venenatis fringilla sapien. Cras eget euismod augue, eget dignissim erat. Cras nec nibh ullamcorper ante rutrum dapibus sed nec tellus. In hac habitasse platea dictumst. Suspendisse semper tellus ac sem tincidunt auctor.",
        hours_owed: 35,
        pref_session: "Y",
        pref_campus: "Mississauga",
        deferral_status: nil,
        deferral_reason: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut eget dignissim sem. Curabitur at semper eros. Aenean nec sem lobortis, scelerisque mi at, aliquam diam. Mauris malesuada elit nibh, sed hendrerit nulla mattis sed. Mauris laoreet imperdiet dictum. Pellentesque risus nulla, varius ut massa ut, venenatis fringilla sapien. Cras eget euismod augue, eget dignissim erat. Cras nec nibh ullamcorper ante rutrum dapibus sed nec tellus. In hac habitasse platea dictumst. Suspendisse semper tellus ac sem tincidunt auctor.",
        appointment_number: nil
        )

      @assignment = @applicant.assignments.create!(
        round_id: "110",
        position_id: @position.id,
        hours: 50
        )
    end

    context "when passed an integer ID" do
      it "returns the assignment" do
        get :show, params: { id: @assignment.id }
        expect(response.status).to eq(200)
        expect(parsed_body).not_to be_empty
        expect(parsed_body).to include(@assignment.attributes.except("created_at", "updated_at"))
      end

      it "returns the assignment for the given applicant_id" do
        get :show, params: { applicant_id: @applicant.id, id: @assignment.id }
        expect(response.status).to eq(200)
        expect(parsed_body).not_to be_empty
        expect(parsed_body).to include(@assignment.attributes.except("created_at", "updated_at"))
      end
    end

    context "when passed a non-integer ID" do
      it "returns 404" do
        get :show, params: { id: "poop" }
        expect(response.status).to eq(404)
      end

      it "returns 404, given an applicant ID" do
        get :show, params: { applicant_id: @applicant.id, id: "poop" }
        expect(response.status).to eq(404)
      end
    end
  end

  describe "POST #create" do
    pending
  end
  describe "PATCH #update" do
    pending

  end
  describe "DELETE #destroy" do
    pending

  end
end
