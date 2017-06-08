require 'rails_helper'

RSpec.describe ApplicationsController, type: :controller do
  describe "GET #index" do
    it "list applications" do
      get :index
      expect(response.status).to eq(200)
      expect(response.body).not_to be_empty
    end
  end

  describe "GET #show" do
    context "when passed an integer ID" do
      it "returns 200" do
        pending " Test database not populated yet "
        get :show, params: { id: 1 }
        expect(response.status).to eq(200)
        expect(response.body).not_to be_empty
      end

    end

    context "when passed a non-integer ID" do
      it "returns 404" do
        get :show, params: { id: "poop" }
        expect(response.status).to eq(404)
      end
    end
  end
end
