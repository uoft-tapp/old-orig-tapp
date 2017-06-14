require 'rails_helper'

RSpec.describe CoursesController, type: :controller do
  context "GET /courses" do
    it "lists all courses" do
      get :index
      expect(response.status).to eq(200)
      expect(response.body).not_to be_empty
    end
  end

  describe "PATCH /courses/{code}" do
    let(:course) do
      Course.create!(
        code: "CSC104H1S",
        campus_code: 1,
        instructor_id: nil,
        course_name: "Computational Thinking",
        estimated_enrolment: nil
      )
    end
    context "when {code} is valid" do
      before(:each) do
        @params = {
          code: course.code,
          estimated_enrolment: 300}
        put :update, params: @params
      end

      it "updates courses" do
        course.reload
        expect(course[:estimated_enrolment]).to eq(@params[:estimated_enrolment])
        expect(response.status).to eq(204)
      end
    end

    context "when {code} is a non-existent courses code" do
      it "it throws status 404" do
        patch :update, params: {code: "csc103h1s"}
        expect(response.status).to eq(404)
      end
    end

  end


end
