require 'rails_helper'

RSpec.describe PositionsController, type: :controller do
  let(:course) do
    Course.create!(
      code: "CSC104H1S",
      campus_code: 1,
      instructor_id: nil,
      course_name: "Computational Thinking",
      estimated_enrolment: nil
    )
  end

  let(:position) do
    course.positions.create!(
      id: 2,
      course_code: "CSC104H1S",
      title: "CSC104H1S",
      duties: "TA duties may include marking, leading skills development tutorials, Q&A/Exam/Assignment/Test Review sessions, and laboratories where noted.",
      qualifications: "Must be enrolled in, or have completed, an undergraduate program in computer science or education (or equivalent). Demonstrated excellent English communication skills. Patience teaching technical concepts to students with a wide variety of non-technical backgrounds. Must have completed or be in the process of completing a course involving functional programming. Must be able to write code in the Intermediate Student Language of Racket, and trace it in the same manner as the Intermediate Student Language Stepper of the DrRacket development environment.",
      hours: 54,
      estimated_count: 17,
      estimated_total_hours: nil
    )
  end

  describe "GET /courses/{course_code}/positions" do
    context "when {course_code} exists" do
      it "lists all positions of {course_code}" do
        get :index, params: {course_code: position.course_code}
        expect(response.status).to eq(200)
        expect(response.body).not_to be_empty
      end
    end

    context "when {course_code} is a non-existent courses code" do
      it "throws status 404" do
        get :index, params: {course_code: "csc103h1s"}
        expect(response.status).to eq(404)
      end
    end
  end

  describe "PATCH /courses/{course_code}/positions/{id}" do
    context "when {id} is valid for {course_code}" do
      before(:each) do
        @params = {
          id: position.id,
          course_code: position.course_code,
          duties: "simplified duties",
          qualifications: "qualifications",
          hours: 20,
          estimated_count: 15,
          estimated_total_hours: 300}
        put :update, params: @params
      end

      it "updates position with {id}" do
        position.reload
        expect(position.as_json(:except => [:title, :created_at, :updated_at]))
          .to eq(@params.as_json)
          expect(response.status).to eq(204)
      end
    end

    context "when {id} is not valid for {course_code}" do
      before(:each) do
        @params = {
          id: 12,
          course_code: position.course_code,
          duties: "simplified duties",
          qualifications: "qualifications",
          hours: 20,
          estimated_count: 15,
          estimated_total_hours: 300}
        put :update, params: @params
      end

      it "throws a status 404" do
        expect(response.status).to eq(404)
      end
    end

  end
end
