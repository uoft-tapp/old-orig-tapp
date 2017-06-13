require 'rails_helper'

RSpec.describe ApplicantsController, type: :controller do
  describe "GET #index" do
    it "list applicants" do
      get :index
      expect(response.status).to eq(200)
      expect(response.body).not_to be_empty
    end
  end

  describe "GET #show" do
    context "when passed an integer ID" do
      let(:applicant) do
        Applicant.create!(
          utorid: "simps169",
          student_number: 1234567890,
          first_name: "Landy",
          last_name: "Simpson",
          email: "simps@mail.com",
          phone: "4165558888",
          address: "100 Jameson Ave Toronto, ON M65-48H")
      end

      let(:parsed_body) { JSON.parse(response.body) }

      it "returns the applicant associated to the integer ID" do
        get :show, params: { id: applicant.id }, format: :json
        expect(response.status).to eq(200)
        expect(parsed_body).not_to be_empty
        expect(parsed_body).to include(applicant.attributes.except("created_at", "updated_at"))
      end
    end

    context "when passed a non-integer ID" do
      it "it returns 404" do
        get :show, params: { id: "poop" }
        expect(response.status).to eq(404)
      end
    end
  end
end
